import 'types/proto.extend/block';

import ContentContainer from 'components/atoms/ContentContainer';
import CopyTextField from 'components/atoms/CopyTextField';
import { VerticalSpacer } from 'components/atoms/Spacer';
import TwoColumns from 'components/atoms/TwoColumns';
import { useCurrentReleaseState } from 'components/hooks/ReleaseHook';
import { renderField } from 'components/organisms/CatalogSections';
import { Formik, FormikProps } from 'formik';
import { CatalogTypes, PATH_APP } from 'libraries/constants';
import {
  getFieldFromSchema,
  getInitialValuesFromSchema,
  getSchemaByName,
  getTemplatedValue,
  shouldShowAccessField,
} from 'libraries/helpers/catalog';
import React from 'react';
import { useDispatch } from 'react-redux';
import { Redirect } from 'react-router';
import { enqueueError } from 'states/app/actions';
import styled from 'styled-components';
import { Block } from 'types/proto/models_pb';

import Card from '@material-ui/core/Card';
import Typography from '@material-ui/core/Typography';

type Props = {
  service: Block;
};

interface StyledComponentProps {
  component: any;
}

const StyledCard = styled(Card)`
  width: 100%;
  padding: 48px 40px;
  box-sizing: border-box;

  .MuiFormControl-root {
    width: 100%;
  }
`;

const ServiceActivity = ({ service }: Props) => {
  const dispatch = useDispatch();
  const { liveRelease } = useCurrentReleaseState(service);
  const catalogName = service.getName() || '';

  const schema = getSchemaByName(catalogName as CatalogTypes);
  if (!schema) {
    // this is a panel and redirect the whole page to service
    // not sure this is a good idea or not
    dispatch(enqueueError('edit-catalog', new Error('unsupported catalog')));
    return <Redirect to={PATH_APP} />;
  }

  const envVars = liveRelease?.getRunconfig()?.getEnvvarsMap();

  const renderConnectionFields = (formikProps: FormikProps<any>) => {
    return schema.access.map((accessField, i) => {
      let node: React.ReactNode;

      if (accessField.type === 'fieldRef') {
        const field = getFieldFromSchema(schema, accessField.keyRef);
        // this should not happen. the template is broken
        if (field === null) {
          node = <></>;
        } else {
          // wrap with responsive wrapper
          node = (
            <TwoColumns layout="EVEN" responsive={true}>
              {renderField(schema, field, formikProps, { forceDisable: true })}
            </TwoColumns>
          );
        }
      } else if (accessField.type === 'template') {
        // handle the template
        // do not show the field if it is not enabled/disabled
        if (!shouldShowAccessField(accessField, envVars)) {
          return <React.Fragment key={`${JSON.stringify(accessField)}`} />;
        }

        const { displayValue, value } = getTemplatedValue(
          accessField.template,
          envVars,
          schema
        );

        node = (
          <TwoColumns layout="EVEN" responsive={true}>
            <CopyTextField
              label={accessField.label}
              value={value}
              displayValue={displayValue}
            />
          </TwoColumns>
        );
      } else {
        node = <></>;
      }

      return (
        <React.Fragment key={`${JSON.stringify(accessField)}`}>
          {node}
          <VerticalSpacer size={32} />
        </React.Fragment>
      );
    });
  };

  const initialValues = getInitialValuesFromSchema(
    schema,
    liveRelease?.getRunconfig()
  );

  if (!liveRelease) {
    return (
      <ContentContainer>
        <Typography color="textPrimary" variant="h6">
          Connections
        </Typography>
        <StyledCard>
          <Typography variant="body2">No running instance yet.</Typography>
        </StyledCard>
      </ContentContainer>
    );
  }
  // Use formik here for using the FormikTextFields
  // so we are not submitting the form
  return (
    <Formik initialValues={initialValues} onSubmit={() => {}}>
      {(formikProps: FormikProps<any>) => {
        return (
          <ContentContainer>
            <Typography color="textPrimary" variant="h6">
              Connections
            </Typography>
            <StyledCard>
              {renderConnectionFields(formikProps)}
              {/*  */}
            </StyledCard>
          </ContentContainer>
        );
      }}
    </Formik>
  );
};

export default ServiceActivity;
