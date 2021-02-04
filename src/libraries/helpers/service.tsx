import React, { ComponentType, ReactNode } from 'react';
import AccessTimeIcon from '@material-ui/icons/AccessTimeRounded';
import CloudCircleIcon from '@material-ui/icons/CloudCircle';
import SettingsApplicationsIcon from '@material-ui/icons/SettingsApplicationsRounded';
import CategoryIcon from '@material-ui/icons/CategoryRounded';
import LayerIcon from '@material-ui/icons/LayersRounded';
import WebIcon from '@material-ui/icons/WebRounded';
import WidgetsIcon from '@material-ui/icons/WidgetsRounded';
import _sumby from 'lodash.sumby';
import SvgIcon from '@material-ui/core/SvgIcon';
import { GithubIcon, GitlabIcon, BitbucketIcon } from 'components/atoms/SVGs';

import {
  Block,
  Release,
  BlockStatus,
  BuildConfig,
  BlockInstance,
} from 'types/proto/models_pb';
import { BlockType, KintoConfig } from 'types';
import { IconProps } from '@material-ui/core/Icon';
import {
  ServiceStateType,
  ServiceStateMap,
  ServiceMetrics,
  LanguageType,
} from 'types/service';
import { FormikErrors, FormikTouched } from 'formik';
import {
  GitProvider,
  GIT_PROVIDER_GITHUB,
  GIT_PROVIDER_GITLAB,
  GIT_PROVIDER_BITBUCKET,
} from 'libraries/constants';

export const getServiceTypeName = (type: BlockType): string => {
  switch (type) {
    case Block.Type.STATIC_SITE:
      return 'Website';
    case Block.Type.WEB_APP:
      return 'Web App';
    case Block.Type.BACKEND_API:
      return 'Backend API';
    case Block.Type.WORKER:
      return 'Backend Worker';
    case Block.Type.CRON_JOB:
    case Block.Type.JOB:
      return 'Job';
    case Block.Type.JAMSTACK:
      return 'Static Site';
    case Block.Type.HELM:
      return 'Helm';
    case Block.Type.CATALOG:
      return 'Catalog';
    // case Block.Type: return 'Docker Image';
  }
  return '';
};

export const getServiceIcon = (
  type: BlockType
): React.ComponentType<IconProps> => {
  switch (type) {
    case Block.Type.STATIC_SITE:
      return CloudCircleIcon;
    case Block.Type.WEB_APP:
      return WebIcon;
    case Block.Type.JAMSTACK:
      return LayerIcon;
    case Block.Type.CATALOG:
      return WidgetsIcon;
    case Block.Type.HELM:
      return WidgetsIcon;
    case Block.Type.BACKEND_API:
      return CategoryIcon;
    case Block.Type.WORKER:
      return SettingsApplicationsIcon;
    case Block.Type.CRON_JOB:
    case Block.Type.JOB:
      return AccessTimeIcon;
    // case BlockType.DockerImage: return DomainDisabledIcon;
  }
  return AccessTimeIcon;
};

export const getGitProvider = (repoUrl: string): GitProvider | undefined => {
  if (repoUrl.match(/^(git:\/\/|ssh:\/\/|http(s):\/\/)?(git@)?github.com/)) {
    return GIT_PROVIDER_GITHUB;
  }

  if (repoUrl.match(/^(git:\/\/|ssh:\/\/|http(s):\/\/)?(git@)?gitlab.com/)) {
    return GIT_PROVIDER_GITLAB;
  }

  if (
    repoUrl.match(
      /^(git:\/\/|ssh:\/\/|http(s):\/\/)?((git|\w+)@)?bitbucket.org/
    )
  ) {
    return GIT_PROVIDER_BITBUCKET;
  }

  return undefined;
};

export const getGitProviderIcon = (
  provider: GitProvider | undefined
): ReactNode | undefined => {
  switch (provider) {
    case GIT_PROVIDER_GITHUB:
      return <SvgIcon component={GithubIcon} />;
    case GIT_PROVIDER_GITLAB:
      return <SvgIcon component={GitlabIcon} />;
    case GIT_PROVIDER_BITBUCKET:
      return <SvgIcon component={BitbucketIcon} />;
  }
  return undefined;
};

export type GitRepoMeta = {
  provider: GitProvider;
  org: string;
  repo: string;
};

export const getGitRepoMeta = (rawUrl: string): GitRepoMeta | null => {
  let url = removeRepoPrefix(rawUrl);
  url = removeGitPostfix(url);
  const provider = getGitProvider(rawUrl);
  if (provider === undefined) {
    return null;
  }

  const tokens = url.split('/');
  const meta: GitRepoMeta = {
    provider,
    org: tokens.length > 0 ? tokens[0] : '',
    repo: tokens.length > 1 ? tokens[1] : '',
  };

  return meta;
};

export const removeRepoPrefix = (repoUrl: string) =>
  repoUrl.replace(/^(git:\/\/|ssh:\/\/|http(s):\/\/)?[\w@.]+(:|\/)/, '');

export const removeGitPostfix = (repoUrl: string) =>
  repoUrl.replace(/\/([^/]+)\.git(\/)?/, '/$1');

export const getHttpsRepository = (rawUrl: string, branch?: string): string => {
  let url = removeRepoPrefix(rawUrl);
  url = removeGitPostfix(url);
  const provider = getGitProvider(rawUrl);
  if (provider === GIT_PROVIDER_GITHUB) {
    return `https://${provider}/${url}${branch ? `/tree/${branch}` : ''}`;
  }

  if (provider === GIT_PROVIDER_GITLAB) {
    return `https://${provider}/${url}${branch ? `/-/tree/${branch}` : ''}`;
  }

  if (provider === GIT_PROVIDER_BITBUCKET) {
    return `https://${provider}/${url}${branch ? `/src/${branch}` : ''}`;
  }
  return '';
};

export const getHttpsRepositoryCommitUrl = (
  rawUrl: string,
  commitSha: string
): string => {
  let url = removeRepoPrefix(rawUrl);
  url = removeGitPostfix(url);
  const provider = getGitProvider(rawUrl);
  if (provider === 'github.com') {
    return `https://${provider}/${url}/commit/${commitSha}`;
  }

  if (provider === 'gitlab.com') {
    return `https://${provider}/${url}/commit/${commitSha}`;
  }

  if (provider === 'bitbucket.org') {
    return `https://${provider}/${url}/commits/${commitSha}`;
  }
  return '';
};

export const getFullRepository = (release: Release): string => {
  const repo = release?.getBuildconfig()?.getRepository();
  if (!repo) {
    return '';
  }
  return getHttpsRepository(repo.getUrl());
};

export const getFullRepositoryWithBranch = (release: Release): string => {
  const repo = release.getBuildconfig()?.getRepository();
  if (!repo) {
    return '';
  }
  return getHttpsRepository(repo.getUrl(), repo.getBranch());
};

export const getFullRepositoryWithCommit = (release: Release): string => {
  const repo = release.getBuildconfig()?.getRepository();
  if (!repo) {
    return '';
  }
  return getHttpsRepositoryCommitUrl(repo.getUrl(), release.getCommitsha());
};

export const formatCommitSha = (commitSha: string): string => {
  return commitSha.substr(0, 7);
};

export const getServiceHealthState = (
  service: Block.AsObject,
  serviceStatesMap: { [blockName: string]: ServiceStateMap }
): ServiceStateType => {
  const state = serviceStatesMap[service.name];
  if (!state) {
    return BlockStatus.State.NOT_SET;
  }
  return getServiceHealthStateFromMap(state);
};

/**
 * Get the health state among different releases.
 * If there exists several status (from different releases),
 * we return the minimum one (most likely it will he Healthy)
 * @param releaseState
 */
export const getServiceHealthStateFromMap = (
  releaseState: ServiceStateMap
): ServiceStateType => {
  return Object.values(releaseState)
    .filter((s) => s !== BlockStatus.State.NOT_SET)
    .reduce((c, v) => (c < v ? c : v), BlockStatus.State.SLEEPING);
};

/**
 * Check if the service is a promoted service or not.
 * Only promoted service will have the parent block Id
 * @param service
 */
export const isPromotedService = (service: Block | undefined): boolean => {
  if (!service) {
    return false;
  }

  return !!service.getParentblockenvid();
};

export const serviceHealthToString = (state: ServiceStateType): string => {
  switch (state) {
    case BlockStatus.State.HEALTHY:
      return 'Healthy';
    case BlockStatus.State.UNHEALTHY:
      return 'Unhealthy';
    case BlockStatus.State.SUSPENDED:
      return 'Suspended';
    case BlockStatus.State.SLEEPING:
      return 'Sleeping';
  }
  return 'UNKNOWN';
};

interface ServiceTotalMetrics {
  totalMemUsage: number;
  totalMemRequest: number;
  totalCpuUsage: number;
  totalCpuRequest: number;
  totalStorageUsage: number;
  totalStorageRequest: number;
}

export const getServiceOverallMetrics = (
  metrics: ServiceMetrics | undefined
): ServiceTotalMetrics => {
  const total: ServiceTotalMetrics = {
    totalMemUsage: 0,
    totalMemRequest: 0,
    totalCpuUsage: 0,
    totalCpuRequest: 0,
    totalStorageUsage: 0,
    totalStorageRequest: 0,
  };

  if (!metrics) {
    return total;
  }

  // So we should only calculate RUNNING pods
  const filteredInstances = Object.values(metrics.instances).filter(
    (instance) => instance.state === BlockInstance.State.RUNNING
  );

  // And for CPU we only want dedicated CPUs
  const filteredDedicatedInstances = filteredInstances.filter(
    (instance) => instance.cpurequests > 0
  );

  total.totalMemUsage =
    _sumby(filteredInstances, (instance) => instance.memusage) || 0;

  total.totalMemRequest =
    _sumby(filteredInstances, (instance) => instance.memrequests) || 0;

  total.totalCpuUsage =
    _sumby(filteredDedicatedInstances, (instance) => instance.cpuusage) || 0;

  total.totalCpuRequest =
    _sumby(filteredDedicatedInstances, (instance) => instance.cpurequests) || 0;

  total.totalStorageUsage =
    _sumby(Object.values(metrics.storages), (s) => s.mountedusageinbytes) || 0;

  total.totalStorageRequest =
    _sumby(Object.values(metrics.storages), (s) => s.capacityinbytes) || 0;
  return total;
};

const memoryMultipliers: { [key: string]: number } = {
  k: 1000,
  M: 1000 ** 2,
  G: 1000 ** 3,
  T: 1000 ** 4,
  P: 1000 ** 5,
  E: 1000 ** 6,
  Ki: 1024,
  Mi: 1024 ** 2,
  Gi: 1024 ** 3,
  Ti: 1024 ** 4,
  Pi: 1024 ** 5,
  Ei: 1024 ** 6,
};

// https://github.com/etiennedi/kubernetes-resource-parser
export const k8sCPUFormatToCore = (input?: string): number => {
  if (!input) {
    return 0;
  }
  const milliMatch = input.match(/^([0-9]+)m$/);
  if (milliMatch) {
    return parseFloat(milliMatch[1]) / 1000;
  }

  return parseFloat(input);
};

export const k8sMemoryFormatToMB = (input?: string): number => {
  if (!input) {
    return 0;
  }
  const unitMatch = input.match(/^([0-9]+)([A-Za-z]{1,2})$/);
  let value = parseInt(input, 10);
  if (unitMatch) {
    const key = unitMatch[2];
    value = parseInt(unitMatch[1], 10) * memoryMultipliers[key];
  }
  return Math.round(value / (1024 * 1024));
};

export const memoryInMBToK8sFormat = (memory: number): string => {
  return `${memory}Mi`;
};

export const cpuInCoreToK8sFormat = (cpu: number): string => {
  return `${Math.round(cpu * 1000)}m`;
};

export const getLanguageNameByType = (lang: LanguageType): string => {
  switch (lang) {
    case BuildConfig.Language.DOCKERFILE:
      return 'Dockerfile';
    case BuildConfig.Language.GOLANG:
      return 'Go';
    case BuildConfig.Language.JAVA:
      return 'Java';
    case BuildConfig.Language.NODEJS:
      return 'NodeJS';
    case BuildConfig.Language.PHP:
      return 'PHP';
    case BuildConfig.Language.PYTHON:
      return 'Python';
    case BuildConfig.Language.RUBY:
      return 'Ruby';
    case BuildConfig.Language.RUST:
      return 'Rust';
    case BuildConfig.Language.ELIXIR:
      return 'Elixir';
  }
  return '';
};

export const getBuildCmdPlaceholderByLang = (lang: LanguageType): string => {
  switch (lang) {
    case BuildConfig.Language.GOLANG:
      return 'go get . && go install -v .';
    case BuildConfig.Language.JAVA:
      return 'mvn compile';
    case BuildConfig.Language.NODEJS:
      return 'npm install && npm run build';
    case BuildConfig.Language.PHP:
      return 'composer install --no-interaction';
    case BuildConfig.Language.PYTHON:
      return 'pip install -r requirements.txt';
    case BuildConfig.Language.RUBY:
      return 'bundle install && bundle package --all';
    case BuildConfig.Language.RUST:
      return 'cargo build --release';
    case BuildConfig.Language.ELIXIR:
      return 'mix local.hex --force && mix local.rebar --force && mix deps.get --quiet && mix ';
  }
  return 'make';
};

export const getRunCmdPlaceholderByLang = (lang: LanguageType): string => {
  switch (lang) {
    case BuildConfig.Language.GOLANG:
      return 'app';
    case BuildConfig.Language.JAVA:
      return 'java -jar ./target/run.jar';
    case BuildConfig.Language.NODEJS:
      return 'npm start';
    case BuildConfig.Language.PHP:
      return 'php -S 0.0.0.0:80';
    case BuildConfig.Language.PYTHON:
      return 'python run.py';
    case BuildConfig.Language.RUBY:
      return 'bundle exec ruby app.rb';
    case BuildConfig.Language.RUST:
      return './target/release/app';
    case BuildConfig.Language.ELIXIR:
      return 'mix run --no-halt';
  }
  return './start.sh';
};

export const getLanguageVersionsFromConfig = (
  config: KintoConfig,
  lang: LanguageType
): {
  label: string;
  value: string;
}[] => {
  const languages = config.languages[lang];
  if (!languages) {
    return [];
  }

  // [k,v] = [12, 12-buster]
  // and the BE accept only the key
  return languages.versionstagsMap.map(([k, v]) => ({
    label: k,
    value: k,
  }));
};

export const countErrorWithFields = (
  errors: FormikErrors<any>,
  fields: string[] | undefined,
  touched?: FormikTouched<any>
): number => {
  if (!fields || fields.length === 0) {
    return 0;
  }

  // TODO: handle envvars
  if (!touched) {
    return _sumby(fields, (field) => (errors[field] ? 1 : 0));
  }

  return _sumby(fields, (field) => (errors[field] && touched[field] ? 1 : 0));
};
