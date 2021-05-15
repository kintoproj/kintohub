import styled from 'styled-components';

export default styled.a`
  color: ${(props) => props.theme.palette.primary.main};
  :hover,
  :active {
    color: ${(props) => props.theme.palette.primary.light};
  }
  :visited {
    color: ${(props) => props.theme.palette.primary.dark};
  }
`;
