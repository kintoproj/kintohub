import 'types/yup';

import * as cron from 'cron-validator';
import {
  getFieldRequiredMessage,
  MESSAGE_DOCKERFILE_PATH_MUST_BE_RELATIVE,
  MESSAGE_ENV_VAR_NAME_MUST_BE_UNIQUE,
  MESSAGE_INVALID_CRON_PATTERN,
  MESSAGE_PORT_MUST_BE_INTEGER,
  MESSAGE_STATIC_OUTPUT_PATH_MUST_BE_RELATIVE,
  MESSAGE_SUBFOLDER_PATH_MUST_BE_RELATIVE
} from 'libraries/constants';
import { REACT_APP_SLEEP_MODE_TTL_MINUTES } from 'libraries/envVars';
import { getIndexFromValue, getValueFromIndex, round } from 'libraries/helpers';
import { KintoConfig } from 'types';
import CatalogSchema from 'types/catalog';
import { AutoScaling, Block, BuildConfig, Release, Repository, Resources, RunConfig } from 'types/proto/models_pb';
import { EditServicePageValues, EnvVar, ServiceType } from 'types/service';
import * as Yup from 'yup';

import { EnvVarSchema, ServiceNameSchema } from './yup';



const LanguageSchema = {
  language: Yup.number().required(),
  dockerfile: Yup.string().when('language', {
    is: BuildConfig.Language.DOCKERFILE,
    then: (schema: any) =>
      schema
        .matches(/^(\.|\w)/, MESSAGE_DOCKERFILE_PATH_MUST_BE_RELATIVE)
        .trim()
        .limit('dockerfile', 2, 128),
  }),
  languageVersion: Yup.string().when('language', {
    is: BuildConfig.Language.DOCKERFILE,
    otherwise: (schema: any) => schema.required('Required'),
  }),
  buildCommand: Yup.string().when('language', {
    is: BuildConfig.Language.DOCKERFILE,
    otherwise: (schema: any) => schema.trim().limit('build command', 2, 1024),
  }),
  startCommand: Yup.string().when('language', {
    is: BuildConfig.Language.DOCKERFILE,
    otherwise: (schema: any) => schema.trim().limit('start command', 2, 1024),
  }),
};

const RepositorySchema = {
  name: ServiceNameSchema,
  repository: Yup.string().fieldRequired('repository URL'),
  branch: Yup.string().fieldRequired('branch'),
  repoToken: Yup.string(),
};

export const getSchemaForServiceByType = (
  serviceType: ServiceType | undefined,
  kintoConfig: KintoConfig
): Yup.ObjectSchema => {
  if (
    serviceType === Block.Type.BACKEND_API ||
    serviceType === Block.Type.WEB_APP
  ) {
    return Yup.object().shape({
      ...LanguageSchema,
      ...RepositorySchema,
      port: Yup.number()
        .integer(MESSAGE_PORT_MUST_BE_INTEGER)
        .min(0, MESSAGE_PORT_MUST_BE_INTEGER)
        .required(getFieldRequiredMessage('port'))
        .typeError(MESSAGE_PORT_MUST_BE_INTEGER),
      subfolderPath: Yup.string()
        .matches(/^(\.|\w)/, MESSAGE_SUBFOLDER_PATH_MUST_BE_RELATIVE)
        .trim()
        .required(getFieldRequiredMessage('subfolder path')),
      envVars: Yup.array()
        .of(
          Yup.object<EnvVar>().shape({
            key: Yup.string().fieldRequired('environment variable name'),
            value: Yup.string(),
          })
        )
        .unique((s) => s.key, MESSAGE_ENV_VAR_NAME_MUST_BE_UNIQUE),
    });
  }

  if (
    serviceType === Block.Type.STATIC_SITE ||
    serviceType === Block.Type.JAMSTACK
  ) {
    return Yup.object().shape({
      ...RepositorySchema,
      // TODO: change back to LanguageSchema once we support other languages
      buildCommand: Yup.string().when('language', {
        is: BuildConfig.Language.DOCKERFILE,
        otherwise: (schema: any) =>
          schema.trim().limit('build command', 2, 1024),
      }),
      subfolderPath: Yup.string()
        .matches(/^(\.|\w)/, MESSAGE_SUBFOLDER_PATH_MUST_BE_RELATIVE)
        .trim()
        .fieldRequired('subfolder path'),
      staticOutputPath: Yup.string()
        .matches(/^(\.|\w)/, MESSAGE_STATIC_OUTPUT_PATH_MUST_BE_RELATIVE)
        .trim()
        .fieldRequired('build output path'),
      envVars: EnvVarSchema,
    });
  }

  // Validation for JOB/CRON_JOB
  if (serviceType === Block.Type.CRON_JOB || serviceType === Block.Type.JOB) {
    return Yup.object().shape({
      ...RepositorySchema,
      ...LanguageSchema,
      subfolderPath: Yup.string()
        .matches(/^(\.|\w)/, MESSAGE_SUBFOLDER_PATH_MUST_BE_RELATIVE)
        .trim()
        .fieldRequired('subfolder path'),
      jobCronPattern: Yup.string().when('isCronJob', {
        is: true,
        then: (schema: any) =>
          schema.test(
            'cron-pattern',
            // eslint-disable-next-line no-template-curly-in-string
            MESSAGE_INVALID_CRON_PATTERN,
            (value: string) => cron.isValidCron(value)
          ),
      }),
      envVars: EnvVarSchema,
    });
  }

  if (serviceType === Block.Type.WORKER) {
    return Yup.object().shape({
      ...RepositorySchema,
      ...LanguageSchema,
      envVars: EnvVarSchema,
    });
  }

  // By default just check the repo
  return Yup.object().shape({
    ...RepositorySchema,
  });
};

export const getInitialValuesByType = (
  serviceName: string,
  repository: Repository,
  buildConfig: BuildConfig,
  runConfig: RunConfig,
  kintoConfig: KintoConfig
): EditServicePageValues => {
  const cpuIndex = getIndexFromValue(
    runConfig.getResources()?.getCpuincore(),
    kintoConfig.cpuOptions?.valuesList,
    kintoConfig.cpuOptions?.defaultvalue
  );

  return {
    name: serviceName,
    repository: repository?.getUrl() || '',
    branch: repository?.getBranch() || '',
    repoToken: repository?.getAccesstoken() || '',
    repoGithubInstallationId: repository?.getGithubinstallationid() || '',
    repoGithubAccessToken: repository?.getGithubusertoken() || '',
    buildCommand: buildConfig.getBuildcommand() || '',
    startCommand: buildConfig.getRuncommand() || '',
    jobTimeOutIndex: getIndexFromValue(
      runConfig.getJobspec()?.getTimeoutinsec(),
      kintoConfig.jobTimeoutOptions?.valuesList,
      kintoConfig.jobTimeoutOptions?.defaultvalue
    ),
    jobCronPattern: runConfig.getJobspec()?.getCronpattern() || '',
    isCronJob: !!runConfig.getJobspec()?.getCronpattern(),
    port: runConfig.getPort() || '',
    dockerfile: buildConfig.getDockerfilefilename() || '',
    language: buildConfig.getLanguage() || BuildConfig.Language.DOCKERFILE,
    languageVersion: buildConfig.getLanguageversion() || '',
    subfolderPath: buildConfig.getPathtocode() || '.',
    staticOutputPath: buildConfig.getPathtostaticoutput() || 'public',
    protocol: runConfig.getProtocol() || RunConfig.Protocol.HTTP,
    envVars:
      runConfig
        .getEnvvarsMap()
        .toArray()
        .map(([k, v]) => ({ key: k, value: v })) || [],
    memoryIndex: getIndexFromValue(
      runConfig.getResources()?.getMemoryinmb(),
      kintoConfig.memoryOptions?.valuesList,
      kintoConfig.memoryOptions?.defaultvalue
    ),
    cpuIndex,
    enabledDedicatedCPU: runConfig.getResources()?.getCpuincore() !== -1,
    enabledAutoScaling: !!runConfig.getAutoscaling(),
    autoScalingRangeIndice: [
      getIndexFromValue(
        runConfig.getAutoscaling()?.getMin(),
        kintoConfig.autoScalingOptions?.valuesList,
        kintoConfig.autoScalingOptions?.defaultminvalue
      ),
      getIndexFromValue(
        runConfig.getAutoscaling()?.getMax(),
        kintoConfig.autoScalingOptions?.valuesList,
        kintoConfig.autoScalingOptions?.defaultmaxvalue
      ),
    ],
    enabledSleepMode: runConfig.getSleepmodeenabled(),
    deployTimeoutIndex: getIndexFromValue(
      runConfig.getTimeoutinsec(),
      kintoConfig.timeoutOptions?.valuesList,
      kintoConfig.timeoutOptions?.defaultvalue
    ),
  };
};

// Make sure the run config is backward compatible
export const guardRunConfig = (
  serviceType: ServiceType,
  runConfig: RunConfig | undefined
): RunConfig | undefined => {
  // Make sure do not send the jobspec if it is not job type
  if (serviceType !== Block.Type.CRON_JOB && serviceType !== Block.Type.JOB) {
    runConfig?.setJobspec(undefined);
  }

  if (
    serviceType !== Block.Type.WEB_APP &&
    serviceType !== Block.Type.BACKEND_API
  ) {
    runConfig?.setSleepmodeenabled(false);
  }

  return runConfig;
};

/**
 * Limit the maximum value for the free user.
 * e.g. if you set CPU to 0.3 on .kintofile
 * this will still set you to non-dedicated CPU
 * @param runConfig
 * @param kintoConfig
 * @param isPayUser
 */
export const updateRunConfigForKintoFile = (
  runConfig: RunConfig,
  kintoConfig: KintoConfig
): void => {
  runConfig.setSleepmodeenabled(true);
  runConfig.setAutoscaling(undefined);
  runConfig.getResources()?.setCpuincore(-1);
  runConfig
    .getResources()
    ?.setMemoryinmb(kintoConfig.memoryOptions?.defaultvalue || 0);
};

/**
 *
 * @param serviceType
 * @param release
 * @param values
 * @param isCreate
 * @param kintoConfig
 */
export const generateConfigsFromValuesAndType = (
  serviceType: ServiceType,
  release: Release,
  values: EditServicePageValues,
  isCreate: boolean,
  kintoConfig: KintoConfig
): {
  name: string;
  buildConfig: BuildConfig;
  runConfig: RunConfig;
} => {
  const isJob =
    serviceType === Block.Type.CRON_JOB || serviceType === Block.Type.JOB;

  // clone the configs to avoid modifying the release itself
  const buildConfig = release.getBuildconfig()?.clone() || new BuildConfig();
  const runConfig = release.getRunconfig()?.clone() || new RunConfig();

  // set build related config
  buildConfig.setLanguage(values.language);
  buildConfig.setDockerfilefilename(values.dockerfile);
  buildConfig.setPathtocode(values.subfolderPath);
  buildConfig.setPathtostaticoutput(values.staticOutputPath);

  // We will never update the repoURL
  buildConfig.getRepository()?.setBranch(values.branch);
  buildConfig.getRepository()?.setAccesstoken(values.repoToken);

  // we will no longer handle the repoGithubInstallationId
  buildConfig.getRepository()?.setGithubusertoken(values.repoGithubAccessToken);

  // TODO: set it to 0 for non Backend/Webapp ?
  runConfig.setPort(values.port);
  runConfig.setType(serviceType);
  runConfig.setTimeoutinsec(
    getValueFromIndex(
      values.deployTimeoutIndex,
      kintoConfig.timeoutOptions?.valuesList
    )
  );

  /**
   * CronJob/Job is exchangeable here
   */
  if (isJob) {
    const js = runConfig.getJobspec();
    if (values.isCronJob) {
      runConfig.setType(Block.Type.CRON_JOB);
      js?.setCronpattern(values.jobCronPattern);
    } else {
      runConfig.setType(Block.Type.JOB);
      js?.setCronpattern('');
    }
    js?.setTimeoutinsec(
      getValueFromIndex(
        values.jobTimeOutIndex,
        kintoConfig.jobTimeoutOptions?.valuesList
      )
    );
  }

  // only webapp and backend api has serverless
  if (
    serviceType === Block.Type.BACKEND_API ||
    serviceType === Block.Type.WEB_APP
  ) {
    runConfig.setSleepmodeenabled(values.enabledSleepMode);

    // set this to 5 minutes first
    runConfig.setSleepmodettlseconds(60 * REACT_APP_SLEEP_MODE_TTL_MINUTES);
  }

  // only backend API support HTTP/GRPC protocols
  if (serviceType === Block.Type.BACKEND_API) {
    runConfig.setProtocol(values.protocol);
  }

  guardRunConfig(serviceType, runConfig);

  if (values.language !== BuildConfig.Language.DOCKERFILE) {
    buildConfig.setLanguageversion(values.languageVersion);
    buildConfig.setBuildcommand(values.buildCommand);
    buildConfig.setRuncommand(values.startCommand);
  }

  const resources = runConfig.getResources() || new Resources();
  resources?.setMemoryinmb(
    getValueFromIndex(values.memoryIndex, kintoConfig.memoryOptions?.valuesList)
  );

  if (values.enabledDedicatedCPU) {
    resources?.setCpuincore(
      round(
        getValueFromIndex(values.cpuIndex, kintoConfig.cpuOptions?.valuesList),
        1
      )
    );

    // Job/Cronjob shouldn't have auto-scaling
    if (values.enabledAutoScaling && !isJob) {
      const as = new AutoScaling();
      as.setMin(
        getValueFromIndex(
          values.autoScalingRangeIndice[0],
          kintoConfig.autoScalingOptions?.valuesList
        )
      );
      as.setMax(
        getValueFromIndex(
          values.autoScalingRangeIndice[1],
          kintoConfig.autoScalingOptions?.valuesList
        )
      );
      // TODO: change this to configurable
      as.setCpupercent(90);

      runConfig.setAutoscaling(as);
    } else {
      runConfig.clearAutoscaling();
    }
  } else {
    resources?.setCpuincore(-1);
    runConfig.clearAutoscaling();
  }

  runConfig.setResources(resources);

  const envVars = runConfig.getEnvvarsMap();
  const buildArgs = buildConfig.getBuildargsMap();

  envVars.clear();
  buildArgs.clear();

  // inject the PORT to env var
  if (isCreate && values.port !== '') {
    envVars.set('PORT', values.port);
    buildArgs.set('PORT', values.port);
  }

  values.envVars.forEach(({ key, value }) => {
    envVars.set(key, value);
    buildArgs.set(key, value);
  });

  return {
    name: values.name,
    buildConfig,
    runConfig,
  };
};

export const generateConfigsForCatalog = (
  envVars: Map<string, string>,
  values: any,
  release?: Release
): {
  buildConfig: BuildConfig;
  runConfig: RunConfig;
} => {
  const buildConfig = release?.getBuildconfig()?.clone() || new BuildConfig();
  const runConfig = release?.getRunconfig()?.clone() || new RunConfig();

  // always false for catalog
  runConfig.setSleepmodeenabled(false);

  // updating the helm values
  const envVarMap = runConfig.getEnvvarsMap();
  envVarMap.clear();

  envVars.forEach((v, k) => {
    envVarMap.set(k, v);
  });

  return {
    buildConfig,
    runConfig,
  };
};

// create the dummy object for create service page to load
export const initCatalog = (
  service: Block,
  {
    schema,
  }: {
    schema: CatalogSchema;
  }
): { release: Release } => {
  const repo = new Repository();
  repo.setUrl(schema.repo);
  repo.setBranch(schema.branch);
  repo.setAccesstoken('');

  const buildConfig = new BuildConfig();
  buildConfig.setLanguage(BuildConfig.Language.DOCKERFILE);
  buildConfig.setRepository(repo);
  buildConfig.setPathtocode('.');
  buildConfig.setLanguage(0);

  const runConfig = new RunConfig();
  runConfig.setType(Block.Type.CATALOG);
  runConfig.setCostoptimizationenabled(true);
  runConfig.setSleepmodeenabled(false);

  // autoScaling should be nil by default meaning enabledAutoScaling is false

  const release = new Release();
  release.setBuildconfig(buildConfig);
  release.setRunconfig(runConfig);

  service.setName(schema.key);
  service.getReleasesMap().set('', release);

  return { release };
};
