import React from 'react';
import Grid from '@material-ui/core/Grid';
import FormikSwitch from 'components/atoms/FormikSwitch';
import { SwitchProps } from '@material-ui/core/Switch';
import Typography from '@material-ui/core/Typography';
import styled from 'styled-components';
import { KINTO_FONT_DARK_GREY, KINTO_FONT_LIGHT_GREY } from 'theme/colors';
import { AlphaBadge } from 'components/atoms/BetaBadge';

type Props = {
  title: string;
  subTitle: string;
  name: string;
  shouldShowAlpha?: boolean;
} & SwitchProps;

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
  shouldShowAlpha,
  ...props
}: Props) => {
  return (
    <StyledDiv>
      <Grid container spacing={4}>
        <Grid item xs={12} md={8}>
          <Typography variant="body1" className="title">
            {`${title} `}
            {shouldShowAlpha && <AlphaBadge />}
          </Typography>
          <Typography variant="caption" className="sub-title">
            {subTitle}
          </Typography>
        </Grid>
        <Grid item xs={10} md={2} />
        <Grid item xs={2} md={2}>
          <FormikSwitch name={name} color="primary" {...props} />
        </Grid>
      </Grid>
    </StyledDiv>
  );
};
