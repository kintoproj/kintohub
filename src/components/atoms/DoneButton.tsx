import React from 'react';
import styled from 'styled-components';
import Button, { ButtonProps } from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import { CypressButtonProps } from 'types/cypress';
import TickIcon from '@material-ui/icons/DoneRounded';

type StyledProps = {
  noPadding?: boolean;
};

type Props = {
  text: string;
  noPadding?: boolean;
} & ButtonProps &
  CypressButtonProps;

const IconButton = styled(
  ({ noPadding, ...rest }: ButtonProps & StyledProps) => <Button {...rest} />
)`
  background-color: ${(props) => props.theme.palette.success.main} !important;
  display: block;
  p {
    font-size: 14px;
    letter-spacing: 1.25px;
    font-weight: 500;
    color: white;
    text-transform: none;
    font-family: Roboto;
  }
  .MuiSvgIcon-root,
  .MuiCircularProgress-root {
    color: white;
  }
  .MuiButton-label {
    justify-content: start;
    padding: ${(props) => (props.noPadding ? '0' : '8px 0')};
    p.MuiTypography-root {
      flex-grow: 1;
    }
  }
`;

export default ({ text, noPadding }: Props) => {
  return (
    <IconButton
      variant="contained"
      disabled={true}
      startIcon={<TickIcon />}
      noPadding={noPadding}
    >
      <Typography>{text}</Typography>
    </IconButton>
  );
};
