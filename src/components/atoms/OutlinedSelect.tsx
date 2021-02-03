import Select, { SelectProps } from '@material-ui/core/Select';
import FormControl from '@material-ui/core/FormControl';

import React from 'react';
import styled from 'styled-components';
import InputLabel from '@material-ui/core/InputLabel';

const StyledFormControl = styled(FormControl)<StyledFormControlProps>`
  ${(props) => (props.fullWidth ? 'width: 100%' : '')}
  .env-form-control {
    width: 100%;
    margin-top: 5px;
  }
  .MuiFormLabel-root {
    // fix the stroke through on the label
    background-color: white;
  }
`;

export type InputOption = {
  label: string;
  value: string;
};

type StyledFormControlProps = {
  fullWidth?: boolean;
};

type Props = {
  label: string;
  options: InputOption[];
};

export default ({
  label,
  options,
  fullWidth,
  ...props
}: Props & SelectProps & StyledFormControlProps) => {
  return (
    <StyledFormControl variant="outlined" fullWidth={!!fullWidth}>
      <InputLabel htmlFor="outlined-select">{label}</InputLabel>
      <Select
        className="select"
        native
        name="outlined-select"
        autoWidth={false}
        fullWidth={true}
        inputProps={{
          name: label,
          id: 'outlined',
        }}
        variant="outlined"
        {...props}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </Select>
    </StyledFormControl>
  );
};
