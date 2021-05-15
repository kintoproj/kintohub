import React from 'react';
import styled from 'styled-components';
import Typography from '@material-ui/core/Typography';
import { VerticalSpacer } from 'components/atoms/Spacer';
import ProgressBar from 'components/atoms/ProgressBar';

interface Props {
  title: string;
  current: string;
  max: string;
  percentage: number;
}

const StyledDiv = styled.div`
  display: flex;
  flex-direction: column;
  color: ${(props) => props.theme.palette.text.secondary};
  span {
    text-transform: none;
  }

  .row {
    display: flex;
    flex-direction: row;
    p {
      align-items: baseline;
      font-size: 10px;
      letter-spacing: 0.18px;
      color: ${(props) => props.theme.palette.text.hint};
    }
    .progress-bar {
      margin-left: 4px;
      width: 35px;
      display: flex;
      align-items: center;
    }
  }
`;

export default ({ title, current, max, percentage }: Props) => {
  return (
    <StyledDiv>
      <Typography variant="overline">{title}</Typography>
      <VerticalSpacer size={2} />
      <div className="row">
        <Typography>{current}</Typography>
        <Typography>{` / ${max}`}</Typography>
        <div className="progress-bar">
          <ProgressBar height={10} percentage={percentage} />
        </div>
      </div>
    </StyledDiv>
  );
};
