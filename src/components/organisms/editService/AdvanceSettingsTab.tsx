import 'types/proto.extend/block';
import 'types/yup';

import FormikSlider from 'components/atoms/FormikSlider';
import { VerticalSpacer } from 'components/atoms/Spacer';
import StyledForm from 'components/atoms/StyledForm';
import { useAppState } from 'components/hooks/ReduxStateHook';
import ResponsiveSwitch from 'components/molecules/ResponsiveSwitch';
import { FormikProps } from 'formik';
import { REACT_APP_SLEEP_MODE_TTL_MINUTES } from 'libraries/envVars';
import { getSliderOptions, getValueFromIndex, round } from 'libraries/helpers';
import { toHumanReadableSeconds } from 'libraries/helpers/date';
import React from 'react';
import styled from 'styled-components';
import { EditServiceTabProps } from 'types/props/editService';
import { EditServicePageValues } from 'types/service';
import { Collapse, Divider, Typography } from '@material-ui/core';
import Grid from '@material-ui/core/Grid';
import { Block } from 'types/proto/kkc_models_pb';

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
  release,
  ...formikProps
}: FormikProps<EditServicePageValues> & EditServiceTabProps) => {
  const { config: kintoConfig } = useAppState();

  const serviceType = release.getRunconfig()?.getType() || Block.Type.NOT_SET;

  const isJob =
    serviceType === Block.Type.CRON_JOB || serviceType === Block.Type.JOB;

  const shouldShowSleepMode =
    serviceType === Block.Type.BACKEND_API ||
    serviceType === Block.Type.WEB_APP;

  return (
    <StyledForm>
      <StyledDiv>
        <Grid container spacing={4}>
          <Grid item xs={12} md={5}>
            <Typography variant="body1" className="title">
              Memory
            </Typography>
            <Typography variant="caption" className="sub-title">
              Set the max memory allowance for this block.
            </Typography>
          </Grid>
          <Grid item xs={10} md={5}>
            <div className="grid-container">
              <FormikSlider
                name="memoryIndex"
                aria-labelledby="discrete-slider"
                valueLabelDisplay="auto"
                {...getSliderOptions(kintoConfig.memoryOptions?.valuesList)}
                color="primary"
              />
            </div>
          </Grid>
          <Grid item xs={2} md={2}>
            <div className="grid-container">
              <Typography variant="body1" className="title">
                {`${getValueFromIndex(
                  formikProps.values.memoryIndex,
                  kintoConfig.memoryOptions?.valuesList
                )}MB`}
              </Typography>
            </div>
          </Grid>
        </Grid>
        <VerticalSpacer size={32} />
        <Divider />
        <VerticalSpacer size={32} />
        {/* Dedicated CPU */}
        <ResponsiveSwitch
          title="Dedicated CPU"
          subTitle="Enable dedicated vCPU resources for your service."
          name="enabledDedicatedCPU"
        />
        <VerticalSpacer size={32} />
        <Collapse
          in={formikProps.values.enabledDedicatedCPU}
          timeout="auto"
          unmountOnExit
        >
          <>
            <Grid container spacing={4}>
              <Grid item xs={12} md={5}>
                <Typography variant="body1" className="title">
                  CPU
                </Typography>
                <Typography variant="caption" className="sub-title">
                  Specify the dedicated amount of vCPU for your service.
                </Typography>
              </Grid>
              <Grid item xs={10} md={5}>
                <div className="grid-container">
                  <FormikSlider
                    name="cpuIndex"
                    aria-labelledby="discrete-slider"
                    valueLabelDisplay="auto"
                    {...getSliderOptions(kintoConfig.cpuOptions?.valuesList)}
                    color="primary"
                    disabled={!formikProps.values.enabledDedicatedCPU}
                  />
                </div>
              </Grid>
              <Grid item xs={2} md={2}>
                <div className="grid-container">
                  <Typography variant="body1" className="title">
                    {`${round(
                      getValueFromIndex(
                        formikProps.values.cpuIndex,
                        kintoConfig.cpuOptions?.valuesList
                      ),
                      1
                    )}`}
                  </Typography>
                </div>
              </Grid>
            </Grid>
            <VerticalSpacer size={32} />
            {!isJob && (
              <>
                <ResponsiveSwitch
                  title="Auto-scaling"
                  subTitle="Enable the ability to scale your service to many instances."
                  name="enabledAutoScaling"
                  disabled={!formikProps.values.enabledDedicatedCPU}
                />
                <VerticalSpacer size={32} />
                <Collapse
                  in={formikProps.values.enabledAutoScaling}
                  timeout="auto"
                  unmountOnExit
                >
                  <Grid container spacing={4}>
                    <Grid item xs={12} md={5}>
                      <Typography variant="body1" className="title">
                        Auto-scaling Range
                      </Typography>
                      <Typography variant="caption" className="sub-title">
                        Set the min and max instances for auto-scaling.
                      </Typography>
                    </Grid>
                    <Grid item xs={10} md={5}>
                      <div className="grid-container">
                        <FormikSlider
                          name="autoScalingRangeIndice"
                          aria-labelledby="discrete-slider"
                          valueLabelDisplay="auto"
                          {...getSliderOptions(
                            kintoConfig.autoScalingOptions?.valuesList
                          )}
                          color="primary"
                          disabled={
                            !(
                              formikProps.values.enabledAutoScaling &&
                              formikProps.values.enabledDedicatedCPU
                            )
                          }
                        />
                      </div>
                    </Grid>
                    <Grid item xs={2} md={2}>
                      <div className="grid-container">
                        <Typography variant="body1" className="title">
                          {formikProps.values.autoScalingRangeIndice
                            .map((asIndex) =>
                              getValueFromIndex(
                                asIndex,
                                kintoConfig.autoScalingOptions?.valuesList
                              )
                            )
                            .join(' - ')}
                        </Typography>
                      </div>
                    </Grid>
                  </Grid>
                  <VerticalSpacer size={32} />
                </Collapse>
              </>
            )}
          </>
        </Collapse>
        <Divider />

        {/* Serverless */}
        {shouldShowSleepMode && (
          <>
            <VerticalSpacer size={32} />
            <ResponsiveSwitch
              title="Sleep Mode"
              subTitle={`The service will automatically go to sleep after ${REACT_APP_SLEEP_MODE_TTL_MINUTES} minutes of inactivity.`}
              name="enabledSleepMode"
            />
          </>
        )}

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
        <VerticalSpacer size={32} />
      </StyledDiv>
    </StyledForm>
  );
};
