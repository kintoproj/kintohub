import { SliderProps } from '@material-ui/core';
import { FormikProps } from 'formik';

export const removeTrailingSlash = (url: string): string => {
  return url.replace(/\/$/, '');
};

// https://stackoverflow.com/questions/15900485/correct-way-to-convert-size-in-bytes-to-kb-mb-gb-in-javascript
export const formatK8SMemory = (
  kbytes: number, // for k8s it is bytes * 1000
  decimals: number = 2
): string => {
  return formatDataUnit(kbytes / 1000, decimals);
};

export const formatDataUnit = (bytes: number, decimals: number = 2): string => {
  if (bytes === 0) return '0';

  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
};

export const formatK8SCpu = (cpu: number): string => {
  if (cpu === 0) return '0';

  return `${parseFloat((cpu / 1000).toFixed(2))}`;
};

export const round = (value: number, decimals: number): number => {
  return Math.round(value * Math.pow(10, decimals)) / Math.pow(10, decimals);
};

export const getIndexFromValue = (
  value?: number,
  values?: number[],
  defaultValue?: number
): number => {
  if (!values) {
    return 0;
  }

  if (value !== undefined) {
    const index = values.findIndex((v) => Math.abs(v - value) < 0.001);
    if (index !== -1) {
      return index;
    }
  }

  if (!defaultValue) {
    return 0;
  }

  return Math.max(0, values.indexOf(defaultValue));
};

export const getValueFromIndex = <T>(index: number, values?: T[]): T => {
  if (!values || index >= values.length) {
    // This will crash the app. but this should not be happen
    throw new Error('invalid option');
  }

  return values[index];
};

export const getSliderOptions = (values?: number[]): SliderProps => {
  if (!values) {
    return {
      min: 0,
      max: 0,
      step: 0,
    };
  }
  return {
    min: 0,
    max: values.length - 1,
    step: 1,
    scale: (x) => Math.round(values[x] * 10) / 10,
  };
};

export const userFriendlyInstanceName = (instanceName: string): string => {
  // remove the uuid for shorten name
  return instanceName.replace(/-(\w{8}-\w{4}-\w{4}-\w{4}-\w{12})-/, '-');
};

export const generatePassword = (length: number): string => {
  const charSet =
    'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!';
  const charSetSize = charSet.length;
  let password = '';

  for (let i = 0; i < length; i++) {
    password += charSet.charAt(Math.floor(Math.random() * charSetSize));
  }
  return password;
};

export const generateKey = (length: number): string => {
  const charSet =
    'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  const charSetSize = charSet.length;
  let password = '';

  for (let i = 0; i < length; i++) {
    password += charSet.charAt(Math.floor(Math.random() * charSetSize));
  }
  return password;
};

export const hasTouchedError = (values: FormikProps<any>): boolean => {
  return (
    Object.keys(values.errors)
      .map((key) => values.touched[key] && !!values.errors[key])
      .reduce((c, v) => c || v, false) || false
  );
};
export const trackError = (type: string, error: Error | string) => {
  // eslint-disable-next-line no-console
  console.error(type, error);
};


export const getAuthorizationHeader = (token: string) => {
  // Now it is secret but not bearer token.
  // We should have logic around that once we implement different type of auth
  return token;
}
