import {
  formatCommitSha, getFullRepositoryWithCommit
} from 'libraries/helpers/service';
import React from 'react';
import styled from 'styled-components';
import { Release } from 'types/proto/kkc_models_pb';

type Props = {
  release: Release | undefined,
  includeBranch?: boolean,
};

const StyledA = styled.a`
`;

export default ({ release, includeBranch }: Props) => {
  const hasCommitSha = release && !!release.getCommitsha();

  if (!hasCommitSha) {
    return <>-</>;
  };

  return (
    <StyledA
      href={`${getFullRepositoryWithCommit(release!)}`}
      target="_blank"
      rel="noopener noreferrer"
      onClick={(evt) => {
        evt.stopPropagation();
      }}
    >
      {includeBranch && `${release!.getBuildconfig()?.getRepository()?.getBranch() || ''}@`}
      {formatCommitSha(release!.getCommitsha())}
    </StyledA>
  );
};
