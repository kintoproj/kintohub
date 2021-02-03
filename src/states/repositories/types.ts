export interface GithubRepository {
  isPrivate: boolean;
  repoUrl: string;
  defaultBranch: string;
}

export interface GithubInstallations {
  [installationId: string]: {
    isFetching: boolean;
    startTimestamp: number;
    userAccessToken: string;
    repositories: GithubRepository[];
  };
}
/**
 * This state stores the map for
 */
export interface RepositoriesState {
  isFetching: boolean;
  githubRepositories: GithubInstallations;
}
