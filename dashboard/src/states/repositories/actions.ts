import { GithubRepository } from './types';

export const ACTION_FETCH_GITHUB_INSTALLED_REPO =
  'START_FETCH_GITHUB_INSTALLED_REPO';
export const ACTION_UPDATE_GITHUB_INSTALLED_REPO =
  'UPDATE_GITHUB_INSTALLED_REPO';

export interface StartFetchGithubRepoAction {
  type: typeof ACTION_FETCH_GITHUB_INSTALLED_REPO;
  installationId: string;
  userAccessToken: string;
  startTime: number;
}

export interface UpdateGithubRepoAction {
  type: typeof ACTION_UPDATE_GITHUB_INSTALLED_REPO;
  installationId: string;
  userAccessToken: string;
  repositories: GithubRepository[];
  completed: boolean;
  startedAt: number;
}

/**
 *
 * @param installationId
 * @param startTime The start timestamp. Update action with outdated timestamp will not update any state
 */
export const startFetchingGithubRepo = (
  installationId: string,
  userAccessToken: string,
  startTime: number
): StartFetchGithubRepoAction => ({
  type: ACTION_FETCH_GITHUB_INSTALLED_REPO,
  installationId,
  userAccessToken,
  startTime,
});

/**
 *
 * @param installationId
 * @param startedAt the 'startTime' from `startFetchGithubRepo`
 * @param repositories
 */
export const updateGithubRepo = (
  installationId: string,
  userAccessToken: string,
  startedAt: number,
  completed: boolean,
  repositories: GithubRepository[]
): UpdateGithubRepoAction => ({
  type: ACTION_UPDATE_GITHUB_INSTALLED_REPO,
  installationId,
  userAccessToken,
  startedAt,
  completed,
  repositories,
});

export type RepositoriesActionTypes =
  | StartFetchGithubRepoAction
  | UpdateGithubRepoAction;
