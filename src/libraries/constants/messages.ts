/**
 * Put all the error messages here.
 * The human readable error message should follow the guidelines:
 * 1) Always starts with capital letter
 * 2) Always ends with full-stop
 * 3) Try not to be too generic or use template in that case.
 */

export const MESSAGE_FIELD_IS_REQUIRED = 'You must enter a valid %field%.';
export const MESSAGE_FIELD_TOO_SHORT =
  'Too short for %field%. Please provide at least %min% characters.';
export const MESSAGE_FIELD_TOO_LONG =
  'Too long for %field%. Please provide at most %max% characters.';

export const MESSAGE_INVALID_EMAIL = 'You must enter a valid email.';
export const MESSAGE_INVALID_SERVICE_NAME =
  'Service Name/ Hostname should contains only alphanumeric characters and/or hyphens. It must not start with a digit or with a hyphen, or end with a hyphen.';
export const MESSAGE_INVALID_ENVIRONMENT_NAME =
  'Environment Name should contains only alphanumeric characters and/or hyphens. It must not start with a digit or with a hyphen, or end with a hyphen.';
export const MESSAGE_INVALID_TAG_NAME =
  'You must enter a valid tag name with no spaces.';
export const MESSAGE_INVALID_DISPLAY_NAME =
  'Display Name may only contain alphanumeric characters or spaces, and must end with an alphanumeric character.';

export const MESSAGE_PORT_MUST_BE_INTEGER = 'Port must be a valid integer.';
export const MESSAGE_ENV_VAR_NAME_MUST_BE_UNIQUE =
  'Environment variable name must be unique.';

export const MESSAGE_SUBFOLDER_PATH_MUST_BE_RELATIVE =
  'Subfolder path must be relative to your project root path (e.g. ".", "src").';
export const MESSAGE_STATIC_OUTPUT_PATH_MUST_BE_RELATIVE =
  'Build output path must be relative to your project root path (e.g. "public", "build").';
export const MESSAGE_DOCKERFILE_PATH_MUST_BE_RELATIVE =
  'Dockerfile path must be relative to your project root path (e.g. "Dockerfile", "./build/Dockerfile").';

export const MESSAGE_CATALOG_INVALID_USERNAME =
  'It should contains alphanumeric characters only. And must start with alphabet.';
export const MESSAGE_CATALOG_INVALID_PASSWORD =
  'Password should contains alphanumeric characters or "!" only. And must contains at least one alphabet.';
export const MESSAGE_CATALOG_INVALID_SECRET =
  'Secret keys should contains alphanumeric characters only. And must contains at least one alphabet.';

export const MESSAGE_INVALID_CRON_PATTERN =
  'You must enter a valid cron pattern.';

export const MESSAGE_CANNOT_AUTHORIZE_GITHUB =
  'Cannot authenticate your Github credentials. It may be expired or invalid. Please try again.';

export const MESSAGE_UNEXPECTED_GITHUB_LOGIN_ERROR =
  'Unexpected error occurs when authorizing with Github. Please contact us if problem persists.';

export const getFieldRequiredMessage = (field: string) => {
  return MESSAGE_FIELD_IS_REQUIRED.replace('%field%', field.toLowerCase());
};

export const getFieldTooShortMessage = (field: string, min: number) => {
  return MESSAGE_FIELD_TOO_SHORT.replace('%field%', field).replace(
    '%min%',
    `${min}`
  );
};

export const getFieldTooLongMessage = (field: string, max: number) => {
  return MESSAGE_FIELD_TOO_LONG.replace('%field%', field).replace(
    '%max%',
    `${max}`
  );
};
