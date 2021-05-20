/* eslint-disable no-param-reassign */
import React from 'react';
import { Field, FieldProps } from 'formik';
import styled from 'styled-components';
import Switch, { SwitchProps } from '@material-ui/core/Switch';

const Container = styled.div`
  width: 100%;
`;

export type InputProps = {
  value: string;
  label: string;
  disabled: boolean;
};

export type Props = {
  name: string;
} & SwitchProps;

export default ({ name, ...rest }: Props) => {
  return (
    <Container>
      <Field name={name}>
        {({
          field, // { name, value, onChange, onBlur }
          form: { touched, errors, setFieldTouched, setFieldValue }, // also values, setXXXX, handleXXXX, dirty, isValid, status, etc.
          meta,
        }: FieldProps) => {
          return (
            <>
              <Switch
                checked={field.value === true}
                {...field}
                {...rest}
                aria-labelledby={field.name}
                onBlur={(e) => setFieldTouched(name)}
                onChange={(e, v) => setFieldValue(name, v)}
              />
            </>
          );
        }}
      </Field>
    </Container>
  );
};
