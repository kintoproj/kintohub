import 'types/proto.extend/block';
import 'types/yup';

import BackArrowButton from 'components/atoms/BackArrowButton';
import { Column } from 'components/atoms/Column';
import { SidePanelContainer } from 'components/atoms/Containers';
import ContentContainer from 'components/atoms/ContentContainer';
import FormModifiedListener from 'components/atoms/FormModifiedListener';
import { CenteredRow } from 'components/atoms/Row';
import SolidIconButton from 'components/atoms/SolidIconButton';
import { HorizontalSpacer, VerticalSpacer } from 'components/atoms/Spacer';
import StatusIcon from 'components/atoms/StatusIcon';
import { useEnvironmentInfo } from 'components/hooks/EnvironmentHook';
import { useAppState, useAuthState } from 'components/hooks/ReduxStateHook';
import ScrollableTabs from 'components/molecules/ScrollableTabs';
import SidePanelTitleBar from 'components/molecules/SidePanelTitleBar';
import CatalogSections from 'components/organisms/CatalogSections';
import { useGRPCWrapper } from 'components/templates/GRPCWrapper';
import { Formik, FormikProps } from 'formik';
import { CatalogTypes, PATH_APP } from 'libraries/constants';
import { createService, editService } from 'libraries/grpc/service';
import {
  getEnvVarsForCatalog,
  getInitialValuesFromSchema,
  getSchemaByName,
  getValidateFunction,
} from 'libraries/helpers/catalog';
import { toDate, toTime, toTimeElapsedShortened } from 'libraries/helpers/date';
import { generateConfigsForCatalog } from 'libraries/helpers/editService';
import {
  getColorByReleaseState,
  getReleaseState,
  getReleaseStateTypeName,
} from 'libraries/helpers/release';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Redirect } from 'react-router-dom';
import {
  dismissNotification,
  enqueueError,
  setLoading,
} from 'states/app/actions';
import { ReleasesState } from 'states/releases/types';
import { doHidePanel, setFormModified } from 'states/sidePanel/actions';
import { RootState } from 'states/types';
import { Tab } from 'types/catalog';
import {
  Block,
  BuildConfig,
  Release,
  RunConfig,
  Status,
} from 'types/proto/models_pb';

import AppBar from '@material-ui/core/AppBar';
import Typography from '@material-ui/core/Typography';
import DeployIcon from '@material-ui/icons/CallMergeRounded';
import { useServiceNavigate } from 'components/hooks/PathHook';

export interface Props {
  isCreate: boolean;
  release: Release;
  service: Block;
  fieldErrors?: { [field: string]: string };
  buildConfig?: BuildConfig;
  runConfig?: RunConfig;
  tabIndex?: number;
}

export default ({
  release,
  service,
  fieldErrors,
  tabIndex,
  isCreate,
  // set for restoring this page after billing popup
  buildConfig: defaultBC,
  runConfig: defaultRC,
}: Props) => {
  const dispatch = useDispatch();

  const { statusMap } = useSelector<RootState, ReleasesState>(
    (state: RootState) => state.releases
  );

  const { envName } = useEnvironmentInfo();

  const { envId } = useAuthState();
  const { config, serverTimeOffset } = useAppState();
  const { navigateToServiceReleaseLogPage } = useServiceNavigate();

  // TODO: the service name is the catalog name for now
  // in the future we may need a subtype for that
  const catalogName = service.getName() || '';

  const schema = getSchemaByName(catalogName as CatalogTypes);
  if (!schema) {
    // this is a panel and redirect the whole page to service
    // not sure this is a good idea or not
    dispatch(enqueueError('edit-catalog', new Error('unsupported catalog')));
    return <Redirect to={PATH_APP} />;
  }

  const [tab, setTab] = useState(tabIndex || 0);
  // initialize the values with default only for creation
  const initialValues = isCreate
    ? getInitialValuesFromSchema(schema)
    : getInitialValuesFromSchema(schema, release.getRunconfig());

  // const validationSchema = getValidationFromSchema(schema, isPayUser);
  const grpcWrapper = useGRPCWrapper();
  const releaseState = getReleaseState(release, statusMap);

  let activeReleaseId: null | string = null;
  for (const r of service.getSortedReleases()) {
    if (getReleaseState(r, statusMap) === Status.State.SUCCESS) {
      activeReleaseId = r.getId();
      break;
    }
  }

  const renderCreateReleaseTitle = () => {
    return (
      <Column>
        <Typography variant="overline" color="textPrimary">
          {`${schema.type} / ${envName}`}
        </Typography>
        <Typography variant="h4">{schema.name}</Typography>
      </Column>
    );
  };

  const renderEditReleaseTitle = () => {
    return (
      <Column>
        <Typography variant="overline" color="textPrimary">
          {`${schema.type} / ${envName}`}
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
          {releaseState === Status.State.RUNNING && (
            <Typography variant="body2">
              {`${toTimeElapsedShortened(
                release.getCreatedat(),
                serverTimeOffset
              )}`}
            </Typography>
          )}
          {releaseState !== Status.State.RUNNING && (
            <Typography variant="body2" className="deploy-time">
              {toTime(release.getCreatedat())} {toDate(release.getCreatedat())}
            </Typography>
          )}
        </CenteredRow>
      </Column>
    );
  };

  // count the error for the badges on the tab
  const countErrorsByTab = (t: Tab, touched: any, errors: any): number => {
    let errorCount = 0;
    t.sections.forEach((section) =>
      section.fields.forEach((field) => {
        if (errors[field.key] && touched[field.key]) {
          errorCount += 1;
        }
      })
    );
    return errorCount;
  };

  return (
    <Formik
      initialValues={initialValues}
      validate={getValidateFunction(schema)}
      onSubmit={async (values, actions) => {
        dispatch(setLoading(true));
        dispatch(setFormModified(false));

        // dismiss the error (if any) when deploying a new one
        dispatch(
          dismissNotification(`service-release-error-${service.getName()}`)
        );
        actions.setSubmitting(true);

        const envVars = getEnvVarsForCatalog(schema, values);

        const { buildConfig, runConfig } = generateConfigsForCatalog(
          envVars,
          values,
          release
        );
        // TODO: configurable
        runConfig.setTimeoutinsec(
          config.timeoutOptions?.valuesList[
            config.timeoutOptions?.valuesList.length - 1
          ] || 0
        );

        try {
          if (isCreate) {
            const resp = await grpcWrapper(createService, {
              name: schema.name,
              envId: envId!,
              buildConfig,
              runConfig,
            });
            navigateToServiceReleaseLogPage(
              resp.getName(),
              resp.getReleaseid()
            );
          } else {
            const resp = await grpcWrapper(editService, {
              serviceName: service.getName(),
              envId: envId!,
              buildConfig,
              runConfig,
              releaseId: release.getId(),
            });
            navigateToServiceReleaseLogPage(
              resp.getName(),
              resp.getReleaseid()
            );
          }
        } catch (error) {
          dispatch(enqueueError('catalog-edit', error));
        } finally {
          actions.setSubmitting(false);
          dispatch(setLoading(false));
          dispatch(doHidePanel());
        }
      }}
    >
      {(formikProps: FormikProps<any>) => {
        // on form mount
        useEffect(() => {
          if (defaultRC && defaultBC) {
            const defaultValues = getInitialValuesFromSchema(schema, defaultRC);
            formikProps.resetForm(defaultValues);
          }
        }, []);

        return (
          <SidePanelContainer>
            <FormModifiedListener isDirty={formikProps.dirty} />
            <AppBar color="transparent" position="static" elevation={1}>
              <SidePanelTitleBar
                titleComponent={
                  isCreate
                    ? renderCreateReleaseTitle()
                    : renderEditReleaseTitle()
                }
                closeButtonComponent={
                  isCreate ? (
                    <BackArrowButton
                      data-cy="create-catalog-back-button"
                      onClick={() => {
                        dispatch(
                          doHidePanel({
                            nextPanel: {
                              type: 'CREATE_SERVICE',
                              tab: 'catalog',
                            },
                          })
                        );
                      }}
                    />
                  ) : undefined
                }
                buttonComponent={
                  <SolidIconButton
                    data-cy="deploy-service-button"
                    isLoading={formikProps.isSubmitting}
                    disabled={!formikProps.dirty}
                    icon={DeployIcon}
                    text="Deploy"
                    onClick={() => {
                      formikProps.submitForm();
                    }}
                  />
                }
              />

              <ScrollableTabs
                tab={tab}
                setTab={setTab}
                tabs={schema.tabs.map((t) => ({
                  label: t.label,
                  errors: countErrorsByTab(
                    t,
                    formikProps.touched,
                    formikProps.errors
                  ),
                }))}
              />
            </AppBar>
            <ContentContainer>
              <CatalogSections
                schema={schema}
                isEdit={!isCreate}
                sections={schema.tabs[tab].sections}
                formikProps={formikProps}
              />
            </ContentContainer>
          </SidePanelContainer>
        );
      }}
    </Formik>
  );
};
