import React from 'react';
import styled from 'styled-components';

import Chip from '@material-ui/core/Chip';
import Typography from '@material-ui/core/Typography';

const StyledChip = styled(Chip)`
  height: 16px !important;
  span {
    font-size: 10px;
    padding: 0 4px;
    text-transform: none;
  }
`;

const StyledTypography = styled(Typography)`
  font-weight: 800 !important;
`;

export const BetaBadge = () => {
  return (
    <StyledChip
      className="test"
      variant="outlined"
      size="small"
      color="primary"
      label="BETA"
    />
  );
};

export const AlphaBadge = () => {
  return (
    <StyledChip
      className="test"
      variant="outlined"
      size="small"
      color="primary"
      label="ALPHA"
    />
  );
};

export const BetaText = () => {
  return (
    <StyledTypography variant="overline" color="primary">
      BETA
    </StyledTypography>
  );
};
