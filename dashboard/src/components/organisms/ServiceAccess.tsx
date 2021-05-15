import 'types/proto.extend/block';

import CopyTextField from 'components/atoms/CopyTextField';
import { VerticalSpacer } from 'components/atoms/Spacer';
import React from 'react';
import styled from 'styled-components';
import { Block } from 'types/proto/models_pb';

import Card from '@material-ui/core/Card';
import Typography from '@material-ui/core/Typography';
import { useCurrentReleaseState } from 'components/hooks/ReleaseHook';
import { useAuthState } from 'components/hooks/ReduxStateHook';

type Props = {
  service: Block;
};

interface StyledComponentProps {
  component: any;
}

const StyledDiv = styled.div`
  .MuiCard-root {
    margin-top: 16px;
    padding: 40px;
    input {
      min-width: 400px;
    }
  }
`;

const ServiceActivity = ({ service }: Props) => {
  const { latestLiveRelease } = useCurrentReleaseState(service);

  const { envId } = useAuthState();

  const serviceType = latestLiveRelease?.getRunconfig()?.getType();
  const externalAccess = latestLiveRelease?.getRunconfig()?.getHost();
  const isStaticWeb =
    serviceType === Block.Type.JAMSTACK ||
    serviceType === Block.Type.STATIC_SITE;

  const isPublicApi = isStaticWeb || service.getIspublicurl();

  return (
    <StyledDiv>
      <Typography color="textPrimary" variant="h6">
        Connections
      </Typography>
      <Card>
        {isPublicApi && (
          <>
            <CopyTextField
              label="External Access"
              value={externalAccess ? `https://${externalAccess}` : ''}
            />
            <VerticalSpacer size={32} />
          </>
        )}
        {!isStaticWeb && (
          <>
            <CopyTextField
              label="Internal Access"
              value={`http://${service.getName()}.${envId}`}
            />
            <Typography variant="caption" color="textSecondary">
              Allows you to call the service from other services within the same
              environment.
            </Typography>
          </>
        )}
      </Card>
    </StyledDiv>
  );
};

export default ServiceActivity;
