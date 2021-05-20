import styled from 'styled-components';

interface Props {
  noPadding?: boolean;
}

export default styled.div<Props>`
  border: 1px solid ${(props) => props.theme.palette.divider};
  background-color: ${(props) => props.theme.palette.background.paper};
  border-radius: 4px;
  padding: ${(props) => (props.noPadding ? '0px' : '32px')};
`;

export const PlainCardContainer = styled.div`
  padding: 32px;
`;

