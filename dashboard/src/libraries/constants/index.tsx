/* eslint-disable no-bitwise */
export const SERVICE_TAB_ACTIVITY = 'activity';
export const SERVICE_TAB_METRICS = 'metrics';
export const SERVICE_TAB_CONSOLE = 'console';
export const SERVICE_TAB_ACCESS = 'access';
export const SERVICE_TAB_CATALOG_ACCESS = 'access_catalog';
export const SERVICE_TAB_SETTINGS = 'settings';
export const SERVICE_TAB_DOMAINS = 'domains';
export const SERVICE_TAB_JOB_ACTIVITY = 'job';

export const PATH_AUTH = '/auth';

// This will redirect to current environment
export const PATH_APP = '/app';

export const PATH_ENV = `${PATH_APP}/environment`;

export const PATH_ACCOUNT = `${PATH_APP}/account`;
export const PATH_BILLING = `${PATH_APP}/billing`;

export const PATH_CALLBACK = '/callback';
export const PATH_MAINTENANCE = '/maintenance';
export const PATH_INTERMEDIATE = '/intermediate';
export const PATH_CREATE_ENV = '/create-env';

export const CATALOG_POSTGRES = 'postgresql';
export const CATALOG_MONGODB = 'mongodb';
export const CATALOG_MYSQL = 'mysql';
export const CATALOG_MINIO = 'minio';
export const CATALOG_REDIS = 'redis';

export type CatalogTypes =
  | typeof CATALOG_POSTGRES
  | typeof CATALOG_MONGODB
  | typeof CATALOG_MYSQL
  | typeof CATALOG_MINIO
  | typeof CATALOG_REDIS;

export const GIT_PROVIDER_GITHUB = 'github.com';
export const GIT_PROVIDER_GITLAB = 'gitlab.com';
export const GIT_PROVIDER_BITBUCKET = 'bitbucket.org';

export type GitProvider =
  | typeof GIT_PROVIDER_GITHUB
  | typeof GIT_PROVIDER_GITLAB
  | typeof GIT_PROVIDER_BITBUCKET;

export * from './messages';
