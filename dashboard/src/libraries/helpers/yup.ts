/* eslint-disable max-len */
import * as Yup from 'yup';
import {
  MESSAGE_INVALID_EMAIL,
  MESSAGE_INVALID_DISPLAY_NAME,
  MESSAGE_INVALID_SERVICE_NAME,
  MESSAGE_INVALID_ENVIRONMENT_NAME,
  MESSAGE_INVALID_TAG_NAME,
  MESSAGE_ENV_VAR_NAME_MUST_BE_UNIQUE,
} from 'libraries/constants';
import 'types/yup';
import { EnvVar } from 'types/service';

/**
 * REGEX that
 * - allow alphanumeric/hyphen
 * - must starts/ends with alphanumeric
 * - no consecutive hyphens
 */

const DOMAIN_REGEX = /^(([a-zA-Z0-9]|[a-zA-Z0-9][a-zA-Z0-9-]*[a-zA-Z0-9])\.)*([A-Za-z0-9]|[A-Za-z0-9][A-Za-z0-9-]*[A-Za-z0-9])$/;

export const PasswordSchema = Yup.string().limit('password', 6, 100);

export const EmailSchema = Yup.string()
  .email(MESSAGE_INVALID_EMAIL)
  .trim()
  .limit('email', 2, 128);

export const UserNameSchema = Yup.string()
  .matches(/^\w[\w\s-]+\w$/, MESSAGE_INVALID_DISPLAY_NAME)
  .limit('display name', 2, 64);

// https://stackoverflow.com/questions/106179/regular-expression-to-match-dns-hostname-or-ip-address
export const ServiceNameSchema = Yup.string()
  .matches(DOMAIN_REGEX, MESSAGE_INVALID_SERVICE_NAME)
  .limit('service name', 2, 48);

export const EnvNameSchema = Yup.string()
  .matches(DOMAIN_REGEX, MESSAGE_INVALID_ENVIRONMENT_NAME)
  .limit('environment name', 2, 32);

export const EnvVarSchema = Yup.array()
  .of(
    Yup.object<EnvVar>().shape({
      key: Yup.string().fieldRequired('environment variable name'),
      value: Yup.string(),
    })
  )
  .unique((s) => s.key, MESSAGE_ENV_VAR_NAME_MUST_BE_UNIQUE);

export const TagNameSchema = Yup.string()
  .matches(DOMAIN_REGEX, MESSAGE_INVALID_TAG_NAME)
  .limit('tag name', 2, 32);
