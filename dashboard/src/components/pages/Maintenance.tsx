import React from 'react';

import Typography from '@material-ui/core/Typography';
import styled from 'styled-components';
import { VerticalSpacer } from 'components/atoms/Spacer';
import BasicLinkButton from 'components/atoms/BasicLinkButton';
import SolidIconButton from 'components/atoms/SolidIconButton';
import { push } from 'connected-react-router';
import { useDispatch } from 'react-redux';

import { bps } from 'theme';
import { PATH_APP } from 'libraries/constants';

const StyledDiv = styled.div`
  box-sizing: border-box;
  padding-top: 35%;
  padding-left: 40px;
  ${bps.down('sm')} {
    padding: 40% 20px 0 20px;
  }
  display: flex;
  flex-direction: column;
  height: 100%;
  .retry-button {
    width: 140px;
  }
`;

/**
 * This page will be revamped soon. Once we have a proper custom error page it should not be named maintenance anymore
 */
const Maintenance = () => {
  const dispatch = useDispatch();

  return (
    <StyledDiv>
      <Typography variant="h1">Sorry :( </Typography>
      <VerticalSpacer size={32} />
      <Typography variant="h4">Something went wrong.</Typography>
      <Typography variant="body2">
        Visit our{' '}
        <BasicLinkButton
          data-cy="support-button"
          href="https://kintohub.statuspage.io/"
        >
          status page
        </BasicLinkButton>{' '}
        for more information or contact us at{' '}
        <BasicLinkButton
          data-cy="support-button"
          onClick={() => {
            const title = 'Support on Kintohub';
            window.open(
              `mailto:support@kintohub.com?subject=${encodeURIComponent(
                title
              )}`,
              '_blank'
            );
          }}
        >
          support@kintohub.com
        </BasicLinkButton>
      </Typography>
      <VerticalSpacer size={32} />
      <SolidIconButton
        data-cy="retry-button"
        text="Back To Home"
        className="retry-button"
        onClick={() => {
          dispatch(push(PATH_APP));
        }}
      >
        Retry
      </SolidIconButton>
    </StyledDiv>
  );
};

export default Maintenance;
