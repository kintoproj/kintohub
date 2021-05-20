import React, { ReactNode, useState } from 'react';
import TextField, { TextFieldProps } from '@material-ui/core/TextField';
import { Field, FieldProps } from 'formik';
import _get from 'lodash.get';

export type Props = {
  name: string;
  endAdornment?: ReactNode;
  passwordInvisible?: boolean;
  autoShrink?: boolean;
} & TextFieldProps;
export default ({
  name,
  helperText,
  error,
  type,
  endAdornment,
  passwordInvisible,
  value,
  autoShrink = false,
  ...rest
}: Props) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <Field name={name}>
      {({
        field, // { name, value, onChange, onBlur }
        form: { touched, errors }, // also values, setXXXX, handleXXXX, dirty, isValid, status, etc.
        meta,
      }: FieldProps) => {
        const fieldTouched = _get(touched, name);
        const fieldError = _get(errors, name);
        return (
          <>
            <TextField
              type={showPassword ? 'text' : 'password'}
              data-cy={`${name}-textfield`}
              {...field}
              {...rest}
              onMouseOver={() => {
                setShowPassword(true);
              }}
              onMouseLeave={() => {
                setShowPassword(false);
              }}
              onFocus={() => {
                setShowPassword(true);
              }}
              onBlur={(evt) => {
                setShowPassword(false);
                field.onBlur(evt);
              }}
              autoComplete="one-time-code"
              InputLabelProps={
                autoShrink
                  ? {}
                  : {
                      shrink: true,
                    }
              }
              error={error || (!!fieldTouched && !!fieldError)}
              helperText={(!!fieldTouched && fieldError) || helperText}
            />
          </>
        );
      }}
    </Field>
  );
};
