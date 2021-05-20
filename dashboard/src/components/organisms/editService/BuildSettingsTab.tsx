import 'types/proto.extend/block';
import 'types/yup';

import FormContainer from 'components/atoms/FormContainer';
import FormikTextField from 'components/atoms/FormikTextField';
import { VerticalSpacer } from 'components/atoms/Spacer';
import StyledForm from 'components/atoms/StyledForm';
import TwoColumns from 'components/atoms/TwoColumns';
import { FormikProps } from 'formik';
import React from 'react';
import { EditServiceTabProps } from 'types/props/editService';
import { EditServicePageValues } from 'types/service';
import { Block, RunConfig } from 'types/proto/models_pb';

import Divider from '@material-ui/core/Divider';
import FormikSelect, { InputProps } from 'components/atoms/FormikSelect';
import { useAppState } from 'components/hooks/ReduxStateHook';
import LanguageSelector from './LanguageSelector';

const ProtocolOptions: InputProps[] = [
  {
    label: 'HTTP',
    value: RunConfig.Protocol.HTTP,
    disabled: false,
  },
  {
    label: 'GRPC',
    value: RunConfig.Protocol.GRPC,
    disabled: false,
  },
];

export default ({
  tabIndex,
  isCreate,
  isPromotedService,
  serviceType,
  ...formikProps
}: FormikProps<EditServicePageValues> & EditServiceTabProps) => {
  const { config } = useAppState();
  return (
    <StyledForm>
      <FormContainer>
        <TwoColumns layout="EVEN" responsive>
          <FormikTextField
            name="name"
            label="Service Name / Hostname"
            variant="outlined"
            helperText={
              isCreate &&
              'You will not be able to change this after deployment.'
            }
            disabled={!isCreate || isPromotedService}
          />
        </TwoColumns>
        <VerticalSpacer size={40} />
        <Divider />
        <VerticalSpacer size={40} />
        <LanguageSelector
          config={config}
          {...formikProps}
          withPort={true}
          disabled={isPromotedService}
        />
        <VerticalSpacer size={40} />
        {serviceType === Block.Type.BACKEND_API && (
          <TwoColumns layout="EVEN" responsive>
            <FormikSelect
              name="protocol"
              label="Protocol"
              variant="outlined"
              type="number"
              handleChange={(evt) => {
                formikProps.setFieldValue(
                  'protocol',
                  parseInt(evt.target.value, 10)
                );
              }}
              handleBlur={formikProps.handleBlur}
              options={ProtocolOptions}
              disabled={isPromotedService}
            />
          </TwoColumns>
        )}
      </FormContainer>
    </StyledForm>
  );
};
