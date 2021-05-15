import { PATH_ENV } from 'libraries/constants';

export const getServicesPath = (envId: string) =>
  `${PATH_ENV}/${envId}/services`

export const getServiceOverviewPageUrl = (envId: string, serviceName: string) =>
  `${PATH_ENV}/${envId}/services/${serviceName}/manage`;

export const getReleaseLogPageUrl = (
  envId: string,
  serviceName: string,
  releaseId: string
): string =>
  `${PATH_ENV}/${envId}/services/${serviceName}/manage/activity/release/${releaseId}`;

export const getReleasePageUrl = (
  envId: string, serviceName: string
): string =>
  `${PATH_ENV}/${envId}/services/${serviceName}/manage/activity`;

export const getConsoleLogPageUrl = (
  envId: string,
  serviceName: string,
  instanceShortName: string
): string =>
  `${PATH_ENV}/${envId}/services/${serviceName}/manage/console/instance/${instanceShortName}`;

export const getAccessPageUrl = (
  envId: string,
  serviceName: string
): string =>
  `${PATH_ENV}/${envId}/services/${serviceName}/manage/access`;
