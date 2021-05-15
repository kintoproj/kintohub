import styled from 'styled-components';
import { Form } from 'formik';

export default styled(Form)`
  border: 1px solid ${(props) => props.theme.palette.divider};
  background: white;
  border-radius: 4px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  color: ${(props) => props.theme.palette.text.secondary};
  width: 100%;

  .MuiFormControl-root {
    width: 100%;
  }
  background-color:${(props) => props.theme.palette.background.default};
`;
