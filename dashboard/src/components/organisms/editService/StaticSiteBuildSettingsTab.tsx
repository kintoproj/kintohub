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
  isPromotedService,
  ...formikProps
}: FormikProps<EditServicePageValues> & EditServiceTabProps) => {
  const { config } = useSelector<RootState, AppState>(
    (state: RootState) => state.app
  );
  /**
   * Right now we support only nodejs. So we disable the language selection
   */
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
          withPort={false}
          isStaticWebsite={true}
          disabled={isPromotedService}
        />
        <VerticalSpacer size={40} />
        <TwoColumns layout="EVEN" responsive>
          <FormikTextField
            name="staticOutputPath"
            label="Build Output Path"
            helperText="The output directory of the static contents generated from build"
            variant="outlined"
            disabled={isPromotedService}
          />
        </TwoColumns>
        <VerticalSpacer size={40} />
      </FormContainer>
    </StyledForm>
  );
};
