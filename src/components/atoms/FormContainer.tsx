import styled from 'styled-components';

type Props = {
  color?: 'primary' | 'secondary';
};

export default styled.div<Props>`
  ${(props) =>
    props.color === 'primary' &&
    `background-color: ${props.theme.palette.background.default};`}
  ${(props) =>
    props.color === 'secondary' &&
    `background-color: ${props.theme.palette.background.paper};`}
  padding: 36px 28px;
  width: 100%;
  box-sizing: border-box;
`;
