import 'types/proto.extend/block';
import 'types/yup';

import FormContainer from 'components/atoms/FormContainer';
import FormikTextField from 'components/atoms/FormikTextField';
import { VerticalSpacer } from 'components/atoms/Spacer';
import StyledForm from 'components/atoms/StyledForm';
import TwoColumns from 'components/atoms/TwoColumns';
import ResponsiveSlider from 'components/molecules/ResponsiveSlider';
import ResponsiveSwitch from 'components/molecules/ResponsiveSwitch';
import * as cron from 'cron-validator';
import * as cronstrue from 'cronstrue';
import { FormikProps } from 'formik';
import { getSliderOptions, getValueFromIndex } from 'libraries/helpers';
import { toHumanReadableSeconds } from 'libraries/helpers/date';
import React from 'react';
import { useSelector } from 'react-redux';
import { AppState } from 'states/app/types';
import { RootState } from 'states/types';
import styled from 'styled-components';
import { KINTO_FONT_DARK_GREY, KINTO_LIGHT_GREY } from 'theme/colors';
import { EditServiceTabProps } from 'types/props/editService';
import { EditServicePageValues } from 'types/service';

import Chip from '@material-ui/core/Chip';
import Collapse from '@material-ui/core/Collapse';
import Divider from '@material-ui/core/Divider';

import LanguageSelector from './LanguageSelector';

const CUSTOM_PATTERNS = [
  {
    label: 'Every minute',
    pattern: '* * * * *',
  },
  {
    label: 'Every 30 minutes',
    pattern: '*/30 * * * *',
  },
  {
    label: 'Hourly',
    pattern: '0 * * * *',
  },
  {
    label: 'Daily at 8:00 UTC',
    pattern: '0 8 * * *',
  },
  {
    label: 'Mondays at 8:00 UTC',
    pattern: '0 8 * * 1',
  },
];

const StyledDiv = styled.div`
  .chip-container {
    .MuiChip-root {
      margin-right: 8px;
      color: ${KINTO_FONT_DARK_GREY};
      background-color: ${KINTO_LIGHT_GREY};
    }
  }
`;

export default ({
  tabIndex,
  isCreate,
  isPromotedService,
  ...formikProps
}: FormikProps<EditServicePageValues> & EditServiceTabProps) => {
  const { config } = useSelector<RootState, AppState>(
    (state: RootState) => state.app
  );
  return (
    <StyledDiv>
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
            withPort={false}
            disabled={isPromotedService}
            {...formikProps}
          />
        </FormContainer>
      </StyledForm>
      <VerticalSpacer size={32} />
      <StyledForm>
        <FormContainer>
          <ResponsiveSlider
            name="jobTimeOutIndex"
            title="Run Timeout"
            subTitle="Maximum time a job can run before timing out."
            disabled={isPromotedService}
            renderValue={() =>
              toHumanReadableSeconds(
                getValueFromIndex(
                  formikProps.values.jobTimeOutIndex,
                  config.jobTimeoutOptions?.valuesList
                )
              )
            }
            {...getSliderOptions(config.jobTimeoutOptions?.valuesList)}
          />
          <VerticalSpacer size={16} />
          <ResponsiveSwitch
            name="isCronJob"
            title="Schedule Cron Job"
            subTitle="Setup your job to run on an automatic schedule per day, hour, week, etc."
          />
          <Collapse
            in={formikProps.values.isCronJob}
            timeout="auto"
            unmountOnExit
          >
            <VerticalSpacer size={16} />
            <TwoColumns layout="EVEN" responsive>
              <FormikTextField
                variant="outlined"
                label="Cron Pattern"
                name="jobCronPattern"
                helperText={
                  cron.isValidCron(formikProps.values.jobCronPattern)
                    ? cronstrue.toString(formikProps.values.jobCronPattern)
                    : undefined
                }
              />
            </TwoColumns>
            <VerticalSpacer size={16} />
            <div className="chip-container">
              {CUSTOM_PATTERNS.map((p) => (
                <Chip
                  key={p.label}
                  label={p.label}
                  onClick={() => {
                    formikProps.setFieldValue('jobCronPattern', p.pattern);
                  }}
                />
              ))}
            </div>
          </Collapse>
        </FormContainer>
      </StyledForm>
    </StyledDiv>
  );
};
