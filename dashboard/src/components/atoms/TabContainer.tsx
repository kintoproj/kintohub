import styled from 'styled-components';
import {
  KINTO_FONT_LIGHT_GREY,
  KINTO_FONT_SUPER_LIGHT_GREY,
} from 'theme/colors';
import { Form } from 'formik';

export default styled(Form)`
  border: 1px solid ${KINTO_FONT_SUPER_LIGHT_GREY};
  background: white;
  border-radius: 4px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  color: ${KINTO_FONT_LIGHT_GREY};
  width: 100%;

  .MuiFormControl-root {
    width: 100%;
  }
`;
