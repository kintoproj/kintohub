import {
  Release,
  Block,
  Repository,
  BuildConfig,
  RunConfig,
  Resources,
  JobSpec,
} from 'types/proto/models_pb';
import { BlockType, KintoConfig } from 'types';

declare module 'types/proto/models_pb' {
  export interface Block {
    getLatestRelease(): Release | null;
    getSortedReleases(): Release[];
    initWithParams(
      name: string,
      serviceType: BlockType,
      repoUrl: string,
      repoBranch: string,
      accessToken: string | null,
      githubUserAccessToken: string | null,
      kintoConfig: KintoConfig
    ): Release;
  }
}

// Deprecated. Use useCurrentReleaseState instead.
// This is only used for comparing release status in ManageService
//
// This will not use the getSortedReleases().sort as this is O(n) but
// getSortedReleases() is at least O(nlogn)
Block.prototype.getLatestRelease = function getLatestRelease() {
  const m = this.getReleasesMap();
  let latest = 0;
  let latestRelease: Release | null = null;
  m.forEach((v, k) => {
    const date: Date = v.getCreatedat()?.toDate()!;
    // make sure return at least one ... there is a chance the date is empty
    if (date?.valueOf() > latest || latestRelease === null) {
      latest = date?.valueOf();
      latestRelease = v;
    }
  });
  return latestRelease;
};

Block.prototype.getSortedReleases = function getSortedReleases() {
  const releasesMap = this.getReleasesMap();

  let releases: Release[] = [];
  releasesMap.forEach((v) => {
    releases.push(v);
  });

  releases = releases.sort((r1, r2) => {
    return (
      (r2.getCreatedat()?.toDate().valueOf() || 0) -
      (r1.getCreatedat()?.toDate().valueOf() || 0)
    );
  });

  return releases;
};

Block.prototype.initWithParams = function initWithParams(
  name: string,
  serviceType: BlockType,
  repoUrl: string,
  repoBranch: string,
  accessToken: string | null,
  githubUserAccessToken: string | null,
  kintoConfig: KintoConfig
) {
  const repo = new Repository();
  repo.setUrl(repoUrl);
  repo.setBranch(repoBranch);
  repo.setAccesstoken(accessToken || '');
  // githubInstallationId is deprecated
  repo.setGithubusertoken(githubUserAccessToken || '');

  const resources = new Resources();
  resources.setCpuincore(kintoConfig.cpuOptions?.defaultvalue || -1);
  resources.setMemoryinmb(kintoConfig.memoryOptions?.defaultvalue || 32);

  const buildConfig = new BuildConfig();
  const jobSpec = new JobSpec();

  if (serviceType === Block.Type.JAMSTACK) {
    buildConfig.setLanguage(BuildConfig.Language.NODEJS);
    try {
      buildConfig.setRuncommand('run');
      buildConfig.setLanguageversion(
        kintoConfig.languages[BuildConfig.Language.NODEJS]
          ?.versionstagsMap[0][0] || '12'
      );
    } catch (error) {
      buildConfig.setLanguageversion('12');
    }
  } else {
    buildConfig.setLanguage(BuildConfig.Language.DOCKERFILE);
    buildConfig.setDockerfilefilename('Dockerfile');
  }

  buildConfig.setRepository(repo);

  const runConfig = new RunConfig();
  runConfig.setType(serviceType);
  runConfig.setResources(resources);
  runConfig.setJobspec(jobSpec);
  // only backend api/ web app are able to have sleep mode
  runConfig.setSleepmodeenabled(
    serviceType === Block.Type.BACKEND_API || serviceType === Block.Type.WEB_APP
  );
  runConfig.setPort('3000'); // in the future we want to have some auto detection on the port ;)

  // autoScaling should be nil by default meaning enabledAutoScaling is false
  const release = new Release();
  release.setBuildconfig(buildConfig);
  release.setRunconfig(runConfig);

  this.setName(name || '');
  this.getReleasesMap().set('', release);

  return release;
};
