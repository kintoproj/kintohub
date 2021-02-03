import styled from 'styled-components';

export default styled.div`
  height: 100vh;
  width: 100%;
  display: flex;
  flex-direction: column;
  position: relative;
  .MuiAppBar-root {
    min-height: 154px;
    display: flex;
    justify-content: space-between;
  }
  .top {
    padding: 22px 68px 0 68px;
    box-sizing: border-box;
    display: flex;
    width: 100%;

    .column {
      display: flex;
      flex-direction: column;
      justify-content: center;
      margin-right: 16px;
    }
    .spacer {
      flex: 1;
    }
  }

  .MuiTab-root {
    text-transform: none;
    width: ;
  }
  .MuiTabs-root {
    padding: 0 68px;
  }
`;
