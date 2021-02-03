import React from 'react';
import styled from 'styled-components';
import { BlockStatus, Block } from 'types/proto/kkc_models_pb';
import Card from '@material-ui/core/Card';
import Typography from '@material-ui/core/Typography';
import { VerticalSpacer } from 'components/atoms/Spacer';
import { getServiceIcon } from 'libraries/helpers/service';
import StatusText from 'components/atoms/StatusText';
import { ServiceStateType } from 'types/service';

type Props = {
  onCreateService: () => void;
};

const StyledCard = styled(Card)`
  display: flex;
  width: 100%;
  min-height: 93px;
  flex-direction: column;
  padding: 36px;
  .icon-row {
    .icon {
      margin-right: 20px;
      opacity: 0.3;
    }
  }
`;

const SERVICE_TYPES = [
  Block.Type.STATIC_SITE,
  Block.Type.JAMSTACK,
  Block.Type.WEB_APP,
  Block.Type.BACKEND_API,
  Block.Type.WORKER,
  Block.Type.CRON_JOB,
  Block.Type.HELM,
];

export const renderServiceState = (serviceState: ServiceStateType) => {
  switch (serviceState) {
    case BlockStatus.State.HEALTHY:
      return <StatusText status="success" text="Healthy" />;
    case BlockStatus.State.SLEEPING:
      return <StatusText status="sleeping" text="Sleeping" />;
    case BlockStatus.State.UNHEALTHY:
    case BlockStatus.State.SUSPENDED:
      return <StatusText status="error" text="Unhealthy" />;
  }
  return <StatusText status="warning" text="Loading" />;
};

export default ({ onCreateService }: Props) => {
  return (
    <StyledCard>
      <Typography variant="h5">Welcome to your new environment</Typography>
      <VerticalSpacer size={20} />
      <Typography variant="body2">
        It’s empty now, but in only a few minutes you can deploy any existing
        git repository into the cloud. Get started by
        <a
          href="/#"
          onClick={(evt) => {
            evt.preventDefault();
            onCreateService();
          }}
        >
          {`${' '}Creating a Service.`}
        </a>
      </Typography>
      <VerticalSpacer size={20} />
      <div className="icon-row">
        {SERVICE_TYPES.map((type) => {
          const Icon = getServiceIcon(type);
          return <Icon className="icon" key={`${type}`} />;
        })}
      </div>
    </StyledCard>
  );
};
