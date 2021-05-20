import React from 'react';
import Grid from '@material-ui/core/Grid';
import FormikSlider from 'components/atoms/FormikSlider';
import { SliderProps } from '@material-ui/core/Slider';
import Typography from '@material-ui/core/Typography';
import styled from 'styled-components';
import { KINTO_FONT_DARK_GREY, KINTO_FONT_LIGHT_GREY } from 'theme/colors';
import BasicLinkButton from 'components/atoms/BasicLinkButton';

type Props = {
  title: string;
  subTitle: string;
  name: string;
  renderValue?: () => string;
  shouldShowUpgrade?: boolean;
  onUpgradeClicked?: () => void;
} & SliderProps;

const StyledDiv = styled.div`
  .title {
    color: ${KINTO_FONT_DARK_GREY};
  }
  .sub-title {
    color: ${KINTO_FONT_LIGHT_GREY};
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
  title,
  subTitle,
  name,
  renderValue,
  shouldShowUpgrade,
  onUpgradeClicked,
  ...props
}: Props) => {
  return (
    <StyledDiv>
      <Grid container spacing={4}>
        <Grid item xs={12} md={6}>
          <Typography variant="body1" className="title">
            {title}
          </Typography>
          {shouldShowUpgrade ? (
            <div className="line-wrapper">
              <Typography
                variant="caption"
                className="sub-title"
              >{`${subTitle} `}</Typography>
              <BasicLinkButton
                onClick={() => {
                  onUpgradeClicked && onUpgradeClicked();
                }}
                data-cy={`upgrade-button-${name}`}
              >
                Enable Pay-as-you-go.
              </BasicLinkButton>
            </div>
          ) : (
            <Typography variant="caption" className="sub-title">
              {subTitle}
            </Typography>
          )}
        </Grid>
        <Grid item xs={10} md={4}>
          <div className="grid-container">
            <FormikSlider name={name} {...props} />
          </div>
        </Grid>
        <Grid item xs={2} md={2}>
          <div className="grid-container">
            {renderValue && (
              <Typography variant="body1" className="title">
                {renderValue()}
              </Typography>
            )}
          </div>
        </Grid>
      </Grid>
    </StyledDiv>
  );
};
