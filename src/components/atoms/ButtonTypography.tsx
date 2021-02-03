import React from 'react';
import styled from 'styled-components';
import Typography, { TypographyProps } from '@material-ui/core/Typography';

type Props = {} & TypographyProps;

const CustomTypography = styled(Typography)`
  p {
    font-size: 14px;
    letter-spacing: 1.25px;
    font-weight: 500;
  }
`;

export default (props: TypographyProps) => {
  return <CustomTypography {...props}>{props.children}</CustomTypography>;
};
