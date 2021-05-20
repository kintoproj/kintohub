import React from 'react';
import styled from 'styled-components';
import IconButton, { IconButtonProps } from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import { CypressButtonProps } from 'types/cypress';

type Props = {
  tooltip?: string;
} & IconButtonProps &
  CypressButtonProps;

// since the tooltip is injected outside this node
// so to customize the UI we need some extra work
// https://github.com/mui-org/material-ui/issues/11467
const StyledTooltip = styled((props) => (
  <Tooltip
    classes={{ popper: props.className, tooltip: 'tooltip' }}
    {...props}
  />
))`
  & .tooltip {
    color: #121212;
  }
`;

const StyledIconButton = styled(IconButton)`
  width: 64px;
  height: 64px;
  span {
    color: rgba(255, 255, 255, 0.5);
    // for avatar
    div {
      background-color: rgba(255, 255, 255, 0.5);
    }
  }
`;

export default ({ children, tooltip, ...props }: Props) => {
  return (
    <StyledTooltip title={tooltip || ''}>
      <StyledIconButton {...props}>{children}</StyledIconButton>
    </StyledTooltip>
  );
};
