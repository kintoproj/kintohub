/* eslint-disable react/no-array-index-key */
import React, { useState } from 'react';
import { FormikProps } from 'formik';
import FormikTextField from 'components/atoms/FormikTextField';
import FormikEnvVarField from 'components/atoms/FormikEnvVarField';
import { VerticalSpacer } from 'components/atoms/Spacer';
import OutlinedIconButton from 'components/atoms/OutlinedIconButton';
import 'types/proto.extend/block';
import TextField from '@material-ui/core/TextField';
import DeleteRoundedIcon from '@material-ui/icons/DeleteRounded';
import GetAppIcon from '@material-ui/icons/GetApp';
import IconButton from '@material-ui/core/IconButton';
import { EditServicePageValues } from 'types/service';
import CopyToClipboard from 'react-copy-to-clipboard';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import Tooltip from '@material-ui/core/Tooltip';
import FormContainer from 'components/atoms/FormContainer';
import StyledForm from 'components/atoms/StyledForm';
import TwoColumns from 'components/atoms/TwoColumns';
import { RowWrapper } from 'components/atoms/Layout';
import 'types/yup';

export default (formikProps: FormikProps<EditServicePageValues>) => {
  const [key, setKey] = useState('');
  const [value, setValue] = useState('');
  const [focusFieldIndex, setfocusFieldIndex] = useState(-1);
  const [open, setOpen] = useState(false);
  const { envVars } = formikProps.values;
  const errors = formikProps.errors.envVars;
  const duplicateError = typeof errors === 'string' ? errors : null;
  const checkInsertRow = () => {
    if (key !== '') {
      formikProps.setFieldValue(`envVars[${envVars.length}]`, {
        key,
        value,
      });
      setfocusFieldIndex(envVars.length);
      setKey('');
      setValue('');
    }
  };
  const copyEnvVars = (): string => {
    let stringEnvVars = '';
    for (let i = 0; i < envVars.length; i++) {
      stringEnvVars += `${envVars[i].key}=${envVars[i].value}\n`;
    }
    return stringEnvVars;
  };
  const handlePaste = (event: React.ClipboardEvent) => {
    event.stopPropagation();
    event.preventDefault();
    const rawData = event.clipboardData.getData('text');
    const envVarGroup = rawData.split('\n');
    for (let i = 0; i < envVarGroup.length; i++) {
      const [envKey, envValue] = envVarGroup[i].split(/=(.*)/);
      let indexOfKey = envVars.findIndex((e) => e.key === envKey);
      if (indexOfKey === -1) {
        indexOfKey = envVars.length;
      }
      envVars[indexOfKey] = {
        key: envKey,
        value: envValue,
      };
    }
    formikProps.setFieldValue('envVars', envVars);
    setfocusFieldIndex(envVars.length);
    setKey('');
    setValue('');
  };
  return (
    <StyledForm>
      <FormContainer>
        <ClickAwayListener onClickAway={() => setOpen(false)}>
          <div>
            <Tooltip
              onClose={() => setOpen(false)}
              open={open}
              disableFocusListener
              disableHoverListener
              disableTouchListener
              title="Environment variables copied to clipboard."
            >
              <CopyToClipboard text={copyEnvVars()}>
                <OutlinedIconButton
                  icon={GetAppIcon}
                  text="Copy to Clipboard"
                  onClick={() => setOpen(true)}
                />
              </CopyToClipboard>
            </Tooltip>
          </div>
        </ClickAwayListener>
        <VerticalSpacer size={24} />
        {envVars.map((_, i) => (
          <React.Fragment key={`envvar-${i}`}>
            <TwoColumns layout="KEY_VALUE" responsive={false}>
              <FormikTextField
                className="key-field"
                name={`envVars[${i}].key`}
                variant="outlined"
                error={!!duplicateError}
                helperText={duplicateError}
              />
              <RowWrapper>
                <FormikEnvVarField
                  name={`envVars[${i}].value`}
                  variant="outlined"
                  autoFocus={i === focusFieldIndex}
                />
                <IconButton
                  onClick={() => {
                    const newEnvVars = envVars;
                    newEnvVars.splice(i, 1);
                    formikProps.setFieldValue('envVars', newEnvVars);
                  }}
                  tabIndex={-1}
                >
                  <DeleteRoundedIcon />
                </IconButton>
              </RowWrapper>
            </TwoColumns>
            <VerticalSpacer size={24} />
          </React.Fragment>
        ))}

        <TwoColumns layout="KEY_VALUE" responsive={false}>
          <TextField
            onBlur={(evt) => {
              checkInsertRow();
            }}
            className="key-field"
            variant="outlined"
            InputLabelProps={{
              shrink: true,
            }}
            label="key"
            value={key}
            onChange={(evt) => setKey(evt.target.value)}
            autoFocus={focusFieldIndex === -1}
            onPaste={handlePaste}
          />
          <TextField
            variant="outlined"
            InputLabelProps={{
              shrink: true,
            }}
            label="value"
            value={value}
            onChange={(evt) => {
              setValue(evt.target.value);
            }}
          />
        </TwoColumns>
      </FormContainer>
    </StyledForm>
  );
};
