import 'types/proto.extend/block';
import 'types/yup';

import BasicLinkButton from 'components/atoms/BasicLinkButton';
import { Column } from 'components/atoms/Column';
import { SidePanelContainer } from 'components/atoms/Containers';
import ContentContainer from 'components/atoms/ContentContainer';
import FormModifiedListener from 'components/atoms/FormModifiedListener';
import { CenteredRow } from 'components/atoms/Row';
import SolidIconButton from 'components/atoms/SolidIconButton';
import { HorizontalSpacer, VerticalSpacer } from 'components/atoms/Spacer';
import StatusIcon from 'components/atoms/StatusIcon';
import { useEnvironmentInfo } from 'components/hooks/EnvironmentHook';
import { useKintoFile } from 'components/hooks/KintoFileHook';
import { useServiceNavigate } from 'components/hooks/PathHook';
import {
  useAppState,
  useAuthState,
  useReleasesState,
} from 'components/hooks/ReduxStateHook';
import FullPageLoading from 'components/molecules/FullPageLoading';
import ScrollableTabs from 'components/molecules/ScrollableTabs';
import SidePanelTitleBar from 'components/molecules/SidePanelTitleBar';
import { useGRPCWrapper } from 'components/templates/GRPCWrapper';
import { Formik, FormikProps } from 'formik';
import { createService, editService } from 'libraries/grpc/service';
import { toDate, toTime, toTimeElapsedShortened } from 'libraries/helpers/date';
import {
  generateConfigsFromValuesAndType,
  getInitialValuesByType,
  getSchemaForServiceByType,
  guardRunConfig,
  updateRunConfigForKintoFile,
} from 'libraries/helpers/editService';
import {
  getColorByReleaseState,
  getReleaseState,
  getReleaseStateTypeName,
  getTagFromPromotedRelease,
} from 'libraries/helpers/release';
import {
  countErrorWithFields,
  getServiceTypeName,
} from 'libraries/helpers/service';
import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Redirect } from 'react-router-dom';
import {
  dismissNotification,
  enqueueError,
  setLoading,
} from 'states/app/actions';
import { doHidePanel, setFormModified } from 'states/sidePanel/actions';
import styled from 'styled-components';
import { EditServiceTabProps } from 'types/props/editService';
import {
  Block,
  BuildConfig,
  Release,
  RunConfig,
  Status,
} from 'types/proto/models_pb';
import { EditServicePageValues, ServiceType } from 'types/service';

import AppBar from '@material-ui/core/AppBar';
import Typography from '@material-ui/core/Typography';
import DeployIcon from '@material-ui/icons/CallMergeRounded';
import CheckCircleIcon from '@material-ui/icons/CheckCircleOutlineRounded';

import AdvanceSettingsTab from '../editService/AdvanceSettingsTab';
import BuildSettingsTab from '../editService/BuildSettingsTab';
import EnvVarsTab from '../editService/EnvVarsTab';
import JobBuildSettingsTab from '../editService/JobBuildSettingsTab';
import RepositoryTab from '../editService/RepositoryTab';
import StaticSiteAdvanceSettingsTab from '../editService/StaticSiteAdvanceSettingsTab';
import StaticSiteBuildSettingsTab from '../editService/StaticSiteBuildSettingsTab';
import TagDetailTab from '../editService/TagDetailTab';
import WorkerBuildSettingsTab from '../editService/WorkerBuildSettingsTab';
import { PATH_APP } from '../../../libraries/constants';

const StyledCenteredRow = styled(CenteredRow)`
  background-color: ${(props) => props.theme.palette.background.paper};
  .text {
    color: ${(props) => props.theme.palette.text.hint};
  }
  padding: 14px;
  border-radius: 4px;
`;

export interface EditServiceTab {
  label: string;
  component: React.ComponentType<
    FormikProps<EditServicePageValues> & EditServiceTabProps
  >;
  disabled?: boolean;
  fields?: string[];
  hideForPromotedService?: boolean;
  showOnlyForPromotedService?: boolean;
}

const ADVANCE_TAB: EditServiceTab = {
  label: 'Advanced',
  component: AdvanceSettingsTab,
  fields: [
    'memoryIndex',
    'cupIndex',
    'autoScalingRangeIndice',
    'deployTimeoutIndex',
    'enabledDedicatedCPU',
  ],
};

const STATIC_SITE_ADVANCE_TAB: EditServiceTab = {
  label: 'Advanced',
  component: StaticSiteAdvanceSettingsTab,
  fields: ['deployTimeoutIndex'],
};

const ENVVAR_TAB: EditServiceTab = {
  label: 'Environment Variables',
  component: EnvVarsTab,
  fields: ['envVars'],
};

const REPO_TAB: EditServiceTab = {
  label: 'Repository',
  component: RepositoryTab,
  fields: ['branch'],
  hideForPromotedService: true,
};

const TAG_TAB: EditServiceTab = {
  label: 'Tag Details',
  component: TagDetailTab,
  fields: [],
  showOnlyForPromotedService: true,
};

const CommonBuildSettingFields = [
  'name',
  'buildCommand',
  'startCommand',
  'dockerfile',
  'language',
  'languageVersion',
  'subfolderPath',
];

const COMMON_TABS = [REPO_TAB, ENVVAR_TAB, TAG_TAB];

export const TABS: Partial<{
  [type: number]: EditServiceTab[];
}> = {
  [Block.Type.JAMSTACK]: [
    {
      label: 'Build Settings',
      component: StaticSiteBuildSettingsTab,
      fields: [...CommonBuildSettingFields],
    },
    ...COMMON_TABS,
    STATIC_SITE_ADVANCE_TAB,
  ],
  [Block.Type.BACKEND_API]: [
    {
      label: 'Build Settings',
      component: BuildSettingsTab,
      fields: [...CommonBuildSettingFields, 'port'],
    },
    ...COMMON_TABS,
    ADVANCE_TAB,
  ],
  [Block.Type.WORKER]: [
    {
      label: 'Build Settings',
      component: WorkerBuildSettingsTab,
      fields: [...CommonBuildSettingFields],
    },
    ...COMMON_TABS,
    ADVANCE_TAB,
  ],
  [Block.Type.WEB_APP]: [
    {
      label: 'Build Settings',
      component: BuildSettingsTab,
      fields: [...CommonBuildSettingFields, 'port'],
    },
    ...COMMON_TABS,
    ADVANCE_TAB,
  ],
  [Block.Type.CRON_JOB]: [
    {
      label: 'Build Settings',
      component: JobBuildSettingsTab,
      fields: [
        ...CommonBuildSettingFields,
        'jobCronPattern',
        'jobTimeOutIndex',
      ],
    },
    ...COMMON_TABS,
    ADVANCE_TAB,
  ],
  [Block.Type.JOB]: [
    {
      label: 'Build Settings',
      component: JobBuildSettingsTab,
      fields: [
        ...CommonBuildSettingFields,
        'jobCronPattern',
        'jobTimeOutIndex',
      ],
    },
    ...COMMON_TABS,
    ADVANCE_TAB,
  ],
};

export interface Props {
  isCreate: boolean;
  release: Release;
  service: Block;
  fieldErrors?: { [field: string]: string };
  tabIndex?: number;
  buildConfig?: BuildConfig;
  runConfig?: RunConfig;
}

export default ({
  isCreate,
  release,
  service,
  fieldErrors,
  tabIndex,
  // set for restoring this page after billing popup
  buildConfig: defaultBC,
  runConfig: defaultRC,
}: Props) => {
  const dispatch = useDispatch();

  const { envId } = useAuthState();

  const { config: kintoConfig, serverTimeOffset } = useAppState();
  const { envName } = useEnvironmentInfo();

  const { statusMap } = useReleasesState();

  const { navigateToServiceReleaseLogPage } = useServiceNavigate();

  const buildConfig = release.getBuildconfig();
  const runConfig = release.getRunconfig();
  const serviceType = runConfig?.getType() || Block.Type.NOT_SET;

  const releaseState = getReleaseState(release, statusMap);

  const isPendingConfig = releaseState === Status.State.REVIEW_DEPLOY;
  const isPromotedService = !!service.getParentblockenvid();

  const grpcWrapper = useGRPCWrapper();

  // we need to
  const tabsByType = (TABS[serviceType] || []).filter(
    (t) =>
      !(t.hideForPromotedService && isPromotedService) &&
      !(t.showOnlyForPromotedService && !isPromotedService)
  );
  if (serviceType === Block.Type.NOT_SET || tabsByType === undefined) {
    dispatch(
      enqueueError('edit-service', new Error('unsupported service type'))
    );
    return <Redirect to={PATH_APP} />;
  }

  let defaultTab = 0;
  if (tabIndex) {
    defaultTab = tabIndex;
  } else if (fieldErrors) {
    for (let i = 0; i < tabsByType.length; i++) {
      const t = tabsByType[i];
      if (countErrorWithFields(fieldErrors, t.fields) > 0) {
        defaultTab = i;
        break;
      }
    }
  }

  const [tab, setTab] = React.useState(defaultTab);

  // buildConfig/runConfig should never be null?
  const [initialValues, setInitialValues] = React.useState(
    getInitialValuesByType(
      service.getName()!,
      buildConfig?.getRepository()!,
      buildConfig!,
      runConfig!,
      kintoConfig
    )
  );

  // Check for the kinto file
  const { isRepoChecking, isKintoFileDetected } = useKintoFile({
    isCreate,
    release,
    serviceType,
    onFileDetected: (bc, rc) => {
      // TODO: in future we may fill the repository from the yaml file as well?
      // e.g. the branch
      updateRunConfigForKintoFile(rc, kintoConfig);
      guardRunConfig(serviceType, rc);

      setInitialValues(
        getInitialValuesByType(
          service.getName()!,
          buildConfig?.getRepository()!, // do not pre-fill the repository
          bc,
          rc,
          kintoConfig
        )
      );
    },
  });

  let activeReleaseId: null | string = null;
  for (const r of service.getSortedReleases()) {
    if (getReleaseState(r, statusMap) === Status.State.SUCCESS) {
      activeReleaseId = r.getId();
      break;
    }
  }

  useEffect(() => {}, []);

  const TabComponent = tabsByType[tab].component;

  const renderEditReleaseTitle = () => {
    return (
      <Column>
        <Typography variant="overline">
          {`${service.getName() || ''} / ${envName}`}
        </Typography>
        <VerticalSpacer size={4} />
        <CenteredRow>
          <StatusIcon
            color={getColorByReleaseState(releaseState)}
            animated={releaseState === Status.State.RUNNING}
          />
          <HorizontalSpacer size={16} />
          <Typography variant="h5">
            {`${
              activeReleaseId === release.getId()
                ? 'Live Version'
                : getReleaseStateTypeName(releaseState)
            }`}
          </Typography>
          <HorizontalSpacer size={16} />
          {releaseState === Status.State.REVIEW_DEPLOY && (
            <Typography variant="body2">
              {getTagFromPromotedRelease(release)}
            </Typography>
          )}
          {releaseState === Status.State.RUNNING && (
            <Typography variant="body2">
              {`${toTimeElapsedShortened(
                release.getCreatedat(),
                serverTimeOffset
              )}`}
            </Typography>
          )}
          {releaseState !== Status.State.RUNNING &&
            releaseState !== Status.State.REVIEW_DEPLOY && (
              <Typography variant="body2" color="textSecondary">
                {toTime(release.getCreatedat())}{' '}
                {toDate(release.getCreatedat())}
              </Typography>
            )}
        </CenteredRow>
      </Column>
    );
  };

  const renderCreateReleaseTitle = (type: ServiceType) => {
    return (
      <Column>
        <Typography variant="overline">{`${envName}`}</Typography>
        <VerticalSpacer size={4} />
        <Typography variant="h5">Create {getServiceTypeName(type)}</Typography>
      </Column>
    );
  };

  return (
    <Formik<EditServicePageValues>
      enableReinitialize={true}
      initialValues={initialValues}
      initialErrors={fieldErrors}
      initialTouched={fieldErrors}
      validationSchema={getSchemaForServiceByType(serviceType, kintoConfig)}
      onSubmit={async (values, actions) => {
        dispatch(setLoading(true));
        dispatch(setFormModified(false));
        // dismiss the error (if any) when deploying a new one
        dispatch(
          dismissNotification(`service-release-error-${service.getName()}`)
        );
        actions.setSubmitting(true);
        try {
          const {
            name,
            buildConfig: bc,
            runConfig: rc,
          } = generateConfigsFromValuesAndType(
            serviceType,
            release!,
            values,
            isCreate,
            kintoConfig
          );
          if (isCreate) {
            const resp = await grpcWrapper(createService, {
              name,
              envId: envId!,
              buildConfig: bc,
              runConfig: rc,
            });

            navigateToServiceReleaseLogPage(
              resp.getName(),
              resp.getReleaseid()
            );
          } else {
            const resp = await grpcWrapper(editService, {
              serviceName: service.getName(),
              envId: envId!,
              buildConfig: bc,
              runConfig: rc,
              releaseId: release.getId(),
            });
            navigateToServiceReleaseLogPage(
              resp.getName(),
              resp.getReleaseid()
            );
          }

          dispatch(doHidePanel());
        } catch (error) {
          // we catch the name duplication error and prevent dismissing the panel
          // and pop the error under the name field for user to change it
          if (
            error.message ===
            'a service with this name already exists in this environment'
          ) {
            actions.setFieldError('name', error.message);
          } else {
            dispatch(enqueueError('service-edit', error));
            dispatch(doHidePanel());
          }
        } finally {
          actions.setSubmitting(false);
          dispatch(setLoading(false));
        }
      }}
    >
      {(formikProps: FormikProps<any>) => {
        // on form mount
        useEffect(() => {
          if (defaultRC && defaultBC) {
            const defaultValues = getInitialValuesByType(
              service.getName()!,
              defaultBC.getRepository()!,
              defaultBC,
              defaultRC,
              kintoConfig
            );
            formikProps.setValues(defaultValues);
          }
        }, []);
        return (
          <SidePanelContainer>
            <FormModifiedListener isDirty={formikProps.dirty} />
            <AppBar color="transparent" position="static" elevation={1}>
              <div className="top">
                <SidePanelTitleBar
                  titleComponent={
                    isCreate
                      ? renderCreateReleaseTitle(serviceType)
                      : renderEditReleaseTitle()
                  }
                  buttonComponent={
                    <SolidIconButton
                      data-cy="deploy-service-button"
                      isLoading={formikProps.isSubmitting}
                      disabled={
                        !isCreate && !isPendingConfig && !formikProps.dirty
                      }
                      icon={DeployIcon}
                      text="Deploy"
                      onClick={() => {
                        formikProps.submitForm();
                      }}
                    />
                  }
                />
              </div>
              <ScrollableTabs
                tab={tab}
                setTab={setTab}
                tabs={tabsByType.map((t) => ({
                  ...t,
                  errors: countErrorWithFields(
                    formikProps.errors,
                    t.fields,
                    formikProps.touched
                  ),
                }))}
              />
            </AppBar>
            {isRepoChecking ? (
              <FullPageLoading absolute={false} />
            ) : (
              <ContentContainer>
                {isKintoFileDetected && (
                  <>
                    <StyledCenteredRow>
                      <CheckCircleIcon color="primary" fontSize="small" />
                      <HorizontalSpacer size={4} />
                      <Typography variant="body2" className="text">
                        We detected a .kinto file in your repository. Some
                        settings have been pre-configured.
                      </Typography>
                      <HorizontalSpacer size={4} />
                      <BasicLinkButton
                        data-cy="edit-github"
                        href="https://docs.kintohub.com"
                      >
                        Learn More
                      </BasicLinkButton>
                    </StyledCenteredRow>
                    <VerticalSpacer size={16} />
                  </>
                )}
                <TabComponent
                  tabIndex={tab}
                  isCreate={isCreate}
                  service={service}
                  release={release}
                  serviceType={serviceType}
                  isPromotedService={isPromotedService}
                  {...formikProps}
                />

                {/* Avoid the discard bar blocking the from */}
                <VerticalSpacer size={120} />
              </ContentContainer>
            )}
          </SidePanelContainer>
        );
      }}
    </Formik>
  );
};
