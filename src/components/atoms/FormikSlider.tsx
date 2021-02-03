/* eslint-disable no-param-reassign */
import React from 'react';
import { Field, FieldProps } from 'formik';
import styled from 'styled-components';
import Slider, { SliderProps } from '@material-ui/core/Slider';
import _get from 'lodash.get';
import { Typography } from '@material-ui/core';

const Container = styled.div`
  width: 100%;
  .error {
    color: red;
    font-size: 12px;
  }
`;

export type InputProps = {
  value: string;
  label: string;
  disabled: boolean;
};

export type Props = {
  name: string;
} & SliderProps;

export default ({ name, ...rest }: Props) => {
  return (
    <Container>
      <Field name={name}>
        {({
          field, // { name, value, onChange, onBlur }
          form: { touched, errors, setFieldTouched, setFieldValue }, // also values, setXXXX, handleXXXX, dirty, isValid, status, etc.
          meta,
        }: FieldProps) => {
          const fieldError = _get(errors, name);
          return (
            <>
              <Slider
                {...field}
                {...rest}
                data-cy={`slider-${name}`}
                aria-labelledby={field.name}
                onBlur={(e) => setFieldTouched(name)}
                onChange={(e, v) => setFieldValue(name, v)}
              />
              {fieldError && (
                <Typography className="error" variant="body2">
                  {fieldError}
                </Typography>
              )}
            </>
          );
        }}
      </Field>
    </Container>
  );
};
