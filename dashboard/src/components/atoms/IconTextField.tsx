import React from 'react';

import FormControl, { FormControlProps } from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import OutlinedInput from '@material-ui/core/OutlinedInput';
import InputAdornment from '@material-ui/core/InputAdornment';
import IconButton from '@material-ui/core/IconButton';
import styled from 'styled-components';

const DivContainer = styled.div`
  .MuiTooltip-tooltip {
    white-space: pre-line;
  }
`;

export type Props = {
  label: string;
  text: string;
  icon: React.ReactNode;
  onClick?: () => void;
} & FormControlProps;

export default ({ label, text, icon, onClick, ...rest }: Props) => {
  return (
    <DivContainer>
      <FormControl variant="outlined" {...rest}>
        <InputLabel shrink={true} htmlFor={`outlined-adornment-${label}`}>
          {label}
        </InputLabel>
        <OutlinedInput
          id={`outlined-adornment-${label}`}
          value={text}
          notched={true}
          endAdornment={
            <InputAdornment position="end">
              <IconButton aria-label={text} edge="end" onClick={onClick}>
                {icon}
              </IconButton>
            </InputAdornment>
          }
          labelWidth={160}
        />
      </FormControl>
    </DivContainer>
  );
};
