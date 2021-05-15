import React from 'react';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import styled from 'styled-components';

type Props = {
  title: string;
  subTitle: string | React.ReactNode;
  hint?: string;
};

const StyledDiv = styled.div`
  .grid-container {
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: flex-end;
  }
  .hint {
    font-size: 12px;
    opacity: 0.7;
  }
`;

export default ({
  title,
  subTitle,
  children,
  hint,
}: React.PropsWithChildren<Props>) => {
  return (
    <StyledDiv>
      <Grid container spacing={4}>
        <Grid item xs={12} md={8}>
          <Typography variant="body1" className="title" color="textPrimary">
            {title}
            {hint && <span className="hint">{` ${hint}`}</span>}
          </Typography>
          {typeof subTitle === 'string' ? (
            <Typography
              variant="caption"
              className="sub-title"
              color="textSecondary"
            >
              {subTitle}
            </Typography>
          ) : (
            subTitle
          )}
        </Grid>
        <Grid item xs={12} md={4}>
          <div className="grid-container">{children}</div>
        </Grid>
      </Grid>
    </StyledDiv>
  );
};
