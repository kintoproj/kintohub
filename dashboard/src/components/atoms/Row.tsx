import styled from 'styled-components';

export const Row = styled.div`
  display: flex;
  flex-direction: row;
`;

export const CenteredRow = styled.div`
  display: flex;
  flex-direction: row;
  justify-items: center;
  align-items: center;
`;

export const SeparatedRow = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
`;

export const SeparatedRowCentered = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;

export const FlexEndRow = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
`;
