import React from 'react';
import IconButton, { IconButtonProps } from '@material-ui/core/IconButton';
import BackIcon from '@material-ui/icons/ArrowBackRounded';

import { CypressButtonProps } from 'types/cypress';

type Props = {} & IconButtonProps & CypressButtonProps;

export default ({ ...rest }: Props) => {
  return (
    <IconButton {...rest}>
      <BackIcon fontSize="small" />
    </IconButton>
  );
};
