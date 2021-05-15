import {
  ACTION_FETCH_GITHUB_INSTALLED_REPO,
  ACTION_UPDATE_GITHUB_INSTALLED_REPO,
  RepositoriesActionTypes,
} from './actions';
import { RepositoriesState } from './types';

const initialState: RepositoriesState = {
  isFetching: false,
  githubRepositories: {},
};

export default function reducer(
  state = initialState,
  action: RepositoriesActionTypes
): RepositoriesState {
  switch (action.type) {
    case ACTION_FETCH_GITHUB_INSTALLED_REPO: {
      const repositories = {
        ...state.githubRepositories,
        [action.installationId]: {
          isFetching: true,
          startTimestamp: action.startTime,
          userAccessToken: action.userAccessToken,
          repositories: [],
        },
      };

      return {
        isFetching: true,
        githubRepositories: repositories,
      };
    }
    case ACTION_UPDATE_GITHUB_INSTALLED_REPO: {
      const repositories = {
        ...state.githubRepositories,
      };

      // if the start time is not the same, we ignore the action
      if (
        repositories[action.installationId] &&
        repositories[action.installationId].startTimestamp !== action.startedAt
      ) {
        return state;
      }

      repositories[action.installationId] = {
        isFetching: !action.completed,
        startTimestamp: action.startedAt,
        userAccessToken: action.userAccessToken,
        repositories: [
          ...(repositories[action.installationId]?.repositories || []),
          ...action.repositories,
        ],
      };

      return {
        isFetching: Object.values(repositories)
          .map((r) => r.isFetching)
          .reduce((c, v) => c || v, false),
        githubRepositories: repositories,
      };
    }
    default:
      return state;
  }
}
