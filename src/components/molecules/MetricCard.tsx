import React from 'react';
import styled from 'styled-components';
import Typography from '@material-ui/core/Typography';
import Card from '@material-ui/core/Card';
import { VerticalSpacer, HorizontalSpacer } from 'components/atoms/Spacer';
import ProgressBar from 'components/atoms/ProgressBar';

type Props = {
  title: string;
  current: string;
  max: string | React.ReactNode;
  percentage: number;
} & React.HTMLAttributes<HTMLDivElement>;

const StyledCard = styled(Card)`
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  .row {
    display: flex;
    flex-direction: row;
    align-items: baseline;
  }
  .grey-text {
    color: ${(props) => props.theme.palette.text.secondary};
  }
`;

export default ({ title, current, max, percentage, ...props }: Props) => {
  return (
    <StyledCard {...props}>
      <Typography variant="overline" className="grey-text">
        {title}
      </Typography>
      <VerticalSpacer size={8} />
      <div className="row">
        <Typography variant="h4">{current}</Typography>
        {typeof max === 'string' ? (
          <Typography
            variant="body2"
            className="grey-text"
          >{`/ ${max}`}</Typography>
        ) : (
          <>
            <HorizontalSpacer size={8} />
            {max}
          </>
        )}
      </div>
      <VerticalSpacer size={16} />
      <ProgressBar height={12} percentage={percentage} />
    </StyledCard>
  );
};
