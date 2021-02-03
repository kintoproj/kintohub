import {
  removeGitPostfix,
  getGitProvider,
  removeRepoPrefix,
  getFullRepositoryWithBranch,
  getGitRepoMeta
} from '../../libraries/helpers/service';
import { Block } from '../../types/proto/kkc_models_pb';
import '../../types/proto.extend/block';

describe('getGitProvider', () => {
  it('should return the correct provider', () => {
    const testCases = [
      'git@github.com:nandiheath/test.git',
      'github.com',
      'https://github.com/nandiheath/test/tree/master',
      'github.com',
      'https://github.com/nandiheath/test.git',
      'github.com',
      'https://gitlab.com/nandiheath/dashboard/-/tree/master',
      'gitlab.com',
      'git@gitlab.com:nandiheath/dashboard.git',
      'gitlab.com',
      'https://gitlab.com/nandiheath/dashboard.git',
      'gitlab.com',
      'https://bitbucket.org/nandi0315/neuralnetwork/src/master/',
      'bitbucket.org',
      'https://nandi0315@bitbucket.org/nandi0315/neuralnetwork.git',
      'bitbucket.org',
      'git@bitbucket.org:nandi0315/neuralnetwork.git',
      'bitbucket.org'
    ];
    for (let i = 0; i < testCases.length; i += 2) {
      expect(getGitProvider(testCases[i])).toEqual(testCases[i + 1]);
    }

    const unresolvedTestCases = [
      'git@bitbucket.com:nandi0315/neuralnetwork.git',
      'ssh://git@nandiheat.com:nandi0315/neuralnetwork.git',
    ];

    for (let i = 0; i < unresolvedTestCases.length; i += 2) {
      expect(getGitProvider(unresolvedTestCases[i])).toEqual(undefined);
    }
  });
});

describe('getGitRepoMeta', () => {
  it('should return the correct provider', () => {
    const testCases = [
      {
        url: 'git@github.com:nandiheath/test.git',
        meta: {
          provider: 'github.com',
          org: 'nandiheath',
          repo: 'test'
        }
      }, {
        url: 'https://github.com/nandiheath/test/tree/master',
        meta: {
          provider: 'github.com',
          org: 'nandiheath',
          repo: 'test'
        }
      }, {
        url: 'https://gitlab.com/nandiheath/dashboard/-/tree/master',
        meta: {
          provider: 'gitlab.com',
          org: 'nandiheath',
          repo: 'dashboard'
        }
      }, {
        url: 'git@gitlab.com:nandiheath/dashboard.git',
        meta: {
          provider: 'gitlab.com',
          org: 'nandiheath',
          repo: 'dashboard'
        }
      }, {
        url: 'https://gitlab.com/nandiheath/dashboard.git',
        meta: {
          provider: 'gitlab.com',
          org: 'nandiheath',
          repo: 'dashboard'
        }
      }, {
        url: 'https://bitbucket.org/nandi0315/neuralnetwork/src/master/',
        meta: {
          provider: 'bitbucket.org',
          org: 'nandi0315',
          repo: 'neuralnetwork'
        }
      }, {
        url: 'https://nandi0315@bitbucket.org/nandi0315/neuralnetwork.git',
        meta: {
          provider: 'bitbucket.org',
          org: 'nandi0315',
          repo: 'neuralnetwork'
        }
      }, {
        url: 'git@bitbucket.org:nandi0315/neuralnetwork.git',
        meta: {
          provider: 'bitbucket.org',
          org: 'nandi0315',
          repo: 'neuralnetwork'
        }
      }
    ];
    for (let i = 0; i < testCases.length; i += 2) {
      expect(getGitRepoMeta(testCases[i].url)).toEqual(testCases[i].meta);
    }

  });
});

describe('removeRepoPrefix', () => {
  it('should remove the protocol/provide/token from the full repo url', () => {
    const testCases = [
      'git@github.com:nandiheath/test.git',
      'nandiheath/test.git',
      'https://github.com/nandiheath/test/tree/master',
      'nandiheath/test/tree/master',
      'https://github.com/nandiheath/test.git',
      'nandiheath/test.git',
      'https://gitlab.com/nandiheath/dashboard/-/tree/master',
      'nandiheath/dashboard/-/tree/master',
      'git@gitlab.com:nandiheath/dashboard.git',
      'nandiheath/dashboard.git',
      'https://gitlab.com/nandiheath/dashboard.git',
      'nandiheath/dashboard.git',
      'https://bitbucket.org/nandi0315/neuralnetwork/src/master/',
      'nandi0315/neuralnetwork/src/master/',
      'https://nandi0315@bitbucket.org/nandi0315/neuralnetwork.git',
      'nandi0315/neuralnetwork.git',
      'git@bitbucket.org:nandi0315/neuralnetwork.git',
      'nandi0315/neuralnetwork.git',
    ];
    for (let i = 0; i < testCases.length; i += 2) {
      expect(removeRepoPrefix(testCases[i])).toEqual(testCases[i + 1]);
    }
  });
});

describe('removeGitPostfix', () => {
  it('should remove the .git with trailing slash', () => {
    const url = 'git@github.com:nandiheath/test.git/';
    const expected = 'git@github.com:nandiheath/test';

    expect(removeGitPostfix(url)).toEqual(expected);
  });
});

describe('getFullRepositoryWithBranch', () => {
  const createDummyBlock = (repoUrl: string, branch: string) => {
    const block = new Block();
    block.initWithParams('test', 0, repoUrl, branch, '', null, {
      languages: {},
    });
    return block;
  };

  it('should return https instead of ssh', () => {
    const block = createDummyBlock(
      'ssh://git@github.com:nandiheath/test.git',
      'master'
    );
    const result = getFullRepositoryWithBranch(block.getLatestRelease()!);

    expect(result).toEqual('https://github.com/nandiheath/test/tree/master');
  });

  it('should return https instead of git', () => {
    const block = createDummyBlock(
      'git://git@github.com:nandiheath/test.git',
      'master'
    );
    const result = getFullRepositoryWithBranch(block.getLatestRelease()!);

    expect(result).toEqual('https://github.com/nandiheath/test/tree/master');
  });

  it('should not contain any .git path', () => {
    const block = createDummyBlock(
      'git@github.com:nandiheath/test.git',
      'master'
    );
    const result = getFullRepositoryWithBranch(block.getLatestRelease()!);

    expect(result).toEqual('https://github.com/nandiheath/test/tree/master');
  });

  it('should work with github path', () => {
    const block = createDummyBlock(
      'git@github.com:nandiheath/test.git',
      'master'
    );
    const result = getFullRepositoryWithBranch(block.getLatestRelease()!);

    expect(result).toEqual('https://github.com/nandiheath/test/tree/master');
  });

  it('should work with gitlab path', () => {
    const block = createDummyBlock(
      'git@gitlab.com:nandiheath/dashboard.git',
      'master'
    );
    const result = getFullRepositoryWithBranch(block.getLatestRelease()!);

    expect(result).toEqual(
      'https://gitlab.com/nandiheath/dashboard/-/tree/master'
    );
  });

  it('should work with bitbucket path', () => {
    const block = createDummyBlock(
      'git@bitbucket.org:nandi0315/neuralnetwork.git',
      'master'
    );
    const result = getFullRepositoryWithBranch(block.getLatestRelease()!);

    expect(result).toEqual(
      'https://bitbucket.org/nandi0315/neuralnetwork/src/master'
    );
  });
});
