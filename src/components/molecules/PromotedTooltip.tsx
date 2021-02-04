import { Row } from 'components/atoms/Row';
import { HorizontalSpacer } from 'components/atoms/Spacer';
import { usePromotedFromService } from 'components/hooks/TagHook';
import React from 'react';
import styled from 'styled-components';
import { Block } from 'types/proto/models_pb';

import Tooltip from '@material-ui/core/Tooltip';
import Typography from '@material-ui/core/Typography';

type Props = {
  service: Block;
};

// https://github.com/mui-org/material-ui/issues/11467
const StyledTooltip = styled((props) => (
  <Tooltip
    classes={{ popper: props.className, tooltip: 'tooltip' }}
    {...props}
  />
))`
  & .tooltip {
    .hint {
      color: ${(props) => props.theme.palette.background.paper};
    }
    .env-name {
      color: ${(props) => props.theme.palette.primary.light};
    }
  }
`;

export default ({ service, children }: React.PropsWithChildren<Props>) => {
  const { environment: promotedFromEnv } = usePromotedFromService(service);

  return (
    <StyledTooltip
      title={
        <Row>
          <Typography className="hint" variant="body2">
            Promoted from{' '}
          </Typography>
          <HorizontalSpacer size={4} />
          <Typography className="env-name" variant="body2">
            {' '}
            {promotedFromEnv?.name || ''}
          </Typography>
        </Row>
      }
    >
      {children}
    </StyledTooltip>
  );
};
