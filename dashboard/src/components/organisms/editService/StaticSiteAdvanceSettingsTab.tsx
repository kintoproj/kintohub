import React from 'react';
import { EditServicePageValues } from 'types/service';
import { FormikProps } from 'formik';
import { VerticalSpacer } from 'components/atoms/Spacer';
import 'types/proto.extend/block';
import 'types/yup';
import styled from 'styled-components';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import Grid from '@material-ui/core/Grid';
import FormikSlider from 'components/atoms/FormikSlider';
import StyledForm from 'components/atoms/StyledForm';

import { toHumanReadableSeconds } from 'libraries/helpers/date';
import { getSliderOptions, getValueFromIndex } from 'libraries/helpers';
import { useSelector } from 'react-redux';
import { RootState } from 'states/types';
import { AppState } from 'states/app/types';
import { EditServiceTabProps } from 'types/props/editService';

const StyledDiv = styled.div`
  padding: 36px 28px;
  width: 100%;
  box-sizing: border-box;
  hr {
    margin: 0 -28px;
  }
  .title {
    color: ${(props) => props.theme.palette.text.primary};
  }
  .sub-title {
    color: ${(props) => props.theme.palette.text.secondary};
  }
  .grid-container {
    height: 100%;
    display: flex;
    align-items: center;
  }
  .MuiSlider-root {
    // slightly align to the text
    margin-top: 3px;
  }
  .MuiSlider-valueLabel {
    span {
      span {
        color: #fff;
      }
    }
  }
`;

export default ({
  tabIndex,
  ...formikProps
}: FormikProps<EditServicePageValues> & EditServiceTabProps) => {
  const { config: kintoConfig } = useSelector<RootState, AppState>(
    (s: RootState) => s.app
  );

  return (
    <StyledForm>
      <StyledDiv>
        {/* Deploy Timeout */}
        <Grid container spacing={4}>
          <Grid item xs={12} md={5}>
            <Typography variant="body1" className="title">
              Deploy Timeout
            </Typography>
            <Typography variant="caption" className="sub-title">
              Maximum time a release can take before timing out.
            </Typography>
          </Grid>
          <Grid item xs={10} md={5}>
            <div className="grid-container">
              <FormikSlider
                name="deployTimeoutIndex"
                aria-labelledby="discrete-slider"
                {...getSliderOptions(kintoConfig.timeoutOptions?.valuesList)}
                color="primary"
              />
            </div>
          </Grid>
          <Grid item xs={2} md={2}>
            <div className="grid-container">
              <Typography variant="body1" className="title">
                {toHumanReadableSeconds(
                  getValueFromIndex(
                    formikProps.values.deployTimeoutIndex,
                    kintoConfig.timeoutOptions?.valuesList
                  )
                )}
              </Typography>
            </div>
          </Grid>
        </Grid>

        <VerticalSpacer size={32} />
        <Divider />
      </StyledDiv>
    </StyledForm>
  );
};
