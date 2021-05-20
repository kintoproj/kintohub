import { useGRPCWrapper } from 'components/templates/GRPCWrapper';
import { GIT_PROVIDER_GITHUB } from 'libraries/constants';
import { genReleaseConfigFromRepo } from 'libraries/grpc/service';
import { getGitRepoMeta } from 'libraries/helpers/service';
import React, { useEffect } from 'react';
import { BuildConfig, Release, RunConfig } from 'types/proto/models_pb';
import { ServiceType } from 'types/service';
import { trackError } from 'libraries/helpers';
import { useEnvironment } from './ReduxStateHook';

interface KintoFileState {
  isRepoChecking: boolean;
  isKintoFileDetected: boolean;
}

type Props = {
  isCreate: boolean;
  release: Release;
  serviceType: ServiceType;
  onFileDetected: (bc: BuildConfig, rc: RunConfig) => void;
};

// custom hooks
export const useKintoFile = ({
  isCreate,
  release,
  serviceType,
  onFileDetected,
}: Props): KintoFileState => {
  const [isRepoChecking, setIsRepoChecking] = React.useState(false);
  const [isKintoFileDetected, setIsKintoFileDetected] = React.useState(false);

  const { envId } = useEnvironment();

  const grpcWrapper = useGRPCWrapper();

  useEffect(() => {
    if (!isCreate) {
      return;
    }

    const asyncCheckRepo = async () => {
      try {
        setIsRepoChecking(true);
        const bc = release.getBuildconfig();
        const repo = bc?.getRepository();
        const repoMeta = getGitRepoMeta(repo?.getUrl() || '');
        if (repoMeta === null || repoMeta.provider !== GIT_PROVIDER_GITHUB) {
          return;
        }

        const resp = await grpcWrapper(genReleaseConfigFromRepo, {
          envId: envId!,
          blockType: serviceType,
          repo: repoMeta.repo,
          branch: repo?.getBranch() || '',
          org: repoMeta.org,
          githubUserToken: repo?.getGithubusertoken() || '',
        });

        onFileDetected(resp.getBuildconfig()!, resp.getRunconfig()!);
        setIsKintoFileDetected(true);
      } catch (error) {
        trackError('ERROR_PARSING_KINTO_FILE', error);
      } finally {
        setIsRepoChecking(false);
      }
    };
    asyncCheckRepo();
  }, []);
  return {
    isRepoChecking,
    isKintoFileDetected,
  };
};
