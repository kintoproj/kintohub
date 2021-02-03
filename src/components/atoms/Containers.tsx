import styled from 'styled-components';
import { bps } from 'theme';

export const SidePanelContainer = styled.div`
  height: 100%;
  width: 75vw;
  ${bps.down('sm')} {
    width: 100vw;
  }
  display: flex;
  flex-direction: column;
`;
