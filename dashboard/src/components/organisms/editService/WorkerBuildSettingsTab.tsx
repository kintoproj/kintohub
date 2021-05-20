import 'types/proto.extend/block';
import 'types/yup';

import FormContainer from 'components/atoms/FormContainer';
import FormikTextField from 'components/atoms/FormikTextField';
import { VerticalSpacer } from 'components/atoms/Spacer';
import StyledForm from 'components/atoms/StyledForm';
import TwoColumns from 'components/atoms/TwoColumns';
import { FormikProps } from 'formik';
import React from 'react';
import { useSelector } from 'react-redux';
import { AppState } from 'states/app/types';
import { RootState } from 'states/types';
import { EditServiceTabProps } from 'types/props/editService';
import { EditServicePageValues } from 'types/service';

import Divider from '@material-ui/core/Divider';

import LanguageSelector from './LanguageSelector';

export default ({
  tabIndex,
  isCreate,
  ...formikProps
}: FormikProps<EditServicePageValues> & EditServiceTabProps) => {
  const { config } = useSelector<RootState, AppState>(
    (state: RootState) => state.app
  );
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
            disabled={!isCreate}
          />
        </TwoColumns>
        <VerticalSpacer size={40} />
        <Divider />
        <VerticalSpacer size={40} />
        <LanguageSelector config={config} {...formikProps} withPort={false} />
      </FormContainer>
    </StyledForm>
  );
};
