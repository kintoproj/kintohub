import React from 'react';
import styled from 'styled-components';
import CircularProgress from '@material-ui/core/CircularProgress';
import Typography from '@material-ui/core/Typography';

type Props = {
  text?: string;
  absolute?: boolean
};

const StyledDiv = styled.div<Props>`
  display: flex;
  justify-content: center;
  align-items: center;
  
  height: ${props => props.absolute ? '100vh' : '100%'};
  width: ${props => props.absolute ? '100vw' : '100%'};
`;

const FullPageLoading = ({ text, absolute = true }: Props) => {
  return (
    <StyledDiv absolute={absolute}>
      <CircularProgress />
      {text && (
        <div className="main">
          <Typography>{text}</Typography>
        </div>
      )}
    </StyledDiv>
  );
};

export default FullPageLoading;
