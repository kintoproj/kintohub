/* eslint-disable no-param-reassign */
import React from 'react';
import { Field, FieldProps } from 'formik';
import Select, { SelectProps } from '@material-ui/core/Select';
import styled from 'styled-components';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';

const Container = styled.div`
  width: 100%;
  .MuiInputBase-root {
    width: 100%;
  }
  .form-control {
    width: 100%;
  }
  .MuiFormLabel-root {
    // fix the stroke through on the label
    background-color: white;
  }
`;

export type InputProps = {
  value: string | number;
  label: string;
  disabled: boolean;
};

export type Props = {
  name: string;
  options: InputProps[];
  allowEmpty?: boolean;
  handleChange: React.ChangeEventHandler<any>;
  handleBlur: React.FocusEventHandler<any>;
} & SelectProps;
export default ({
  name,
  label,
  options,
  allowEmpty,
  handleChange,
  handleBlur,
  ...rest
}: Props) => {
  return (
    <Container>
      <Field name={name}>
        {({
          field, // { name, value, onChange, onBlur }
          form: { touched, errors }, // also values, setXXXX, handleXXXX, dirty, isValid, status, etc.
          meta,
        }: FieldProps) => {
          const fieldTouched = touched[name];
          const fieldError = errors[name];
          return (
            <>
              <FormControl variant="outlined" className="form-control">
                <InputLabel htmlFor={`outlined-${name}`}>{label}</InputLabel>
                <Select
                  native
                  name={name}
                  autoWidth={false}
                  inputProps={{
                    name: label,
                    id: `outlined-${name}`,
                  }}
                  {...field}
                  {...rest}
                  onBlur={(evt) => {
                    evt.target.name = name;
                    handleBlur(evt);
                  }}
                  onChange={(evt) => {
                    evt.target.name = name;
                    handleChange(evt);
                  }}
                  error={!!fieldTouched && !!fieldError}
                >
                  {allowEmpty && <option aria-label="None" value="" />}
                  {options.map((opt) => (
                    <option
                      key={opt.value}
                      value={opt.value}
                      disabled={opt.disabled}
                    >
                      {opt.label}
                    </option>
                  ))}
                </Select>
              </FormControl>
            </>
          );
        }}
      </Field>
    </Container>
  );
};
