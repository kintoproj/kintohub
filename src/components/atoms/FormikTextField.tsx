import React, { ReactNode, useState } from 'react';
import TextField, { TextFieldProps } from '@material-ui/core/TextField';
import { Field, FieldProps } from 'formik';
import _get from 'lodash.get';
import { InputAdornment, IconButton } from '@material-ui/core';
import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';

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
              type={
                type === 'password'
                  ? `${showPassword ? 'text' : 'password'}`
                  : type
              }
              data-cy={`${name}-textfield`}
              {...rest}
              {...field}
              InputProps={{
                endAdornment:
                  endAdornment ||
                  (type === 'password' && !passwordInvisible && (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={() => {
                          setShowPassword(!showPassword);
                        }}
                        tabIndex={-1}
                      >
                        {showPassword ? <Visibility /> : <VisibilityOff />}
                      </IconButton>
                    </InputAdornment>
                  )),
              }}
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
