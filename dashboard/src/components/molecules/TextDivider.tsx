import React from 'react';
import Divider from '@material-ui/core/Divider';
import { CenteredRow } from 'components/atoms/Row';
import { Typography } from '@material-ui/core';

type Props = {
  text: string
};

export default ({ text }: Props) => {
  return (
    <CenteredRow>
      <Divider />
      <Typography color="textPrimary" >{text}</Typography>
      <Divider />
    </CenteredRow>
  );
};
