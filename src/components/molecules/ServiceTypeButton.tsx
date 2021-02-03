import React from 'react';
import styled from 'styled-components';
import { CypressButtonProps } from 'types/cypress';
import Button from 'components/atoms/Button';
import { HorizontalSpacer } from 'components/atoms/Spacer';
import { BetaBadge } from 'components/atoms/BetaBadge';
import Typography from '@material-ui/core/Typography';

export interface DisableProps {
  disabled?: boolean;
}
export interface Props extends DisableProps {
  icon: React.ComponentType;
  title: string;
  description: string;
  onClick: (evt: React.MouseEvent) => void;
  isBeta?: boolean;
}

const Container = styled.div<DisableProps>`
  .MuiButton-root {
    border: 1px solid ${(props) => props.theme.palette.divider};
    border-radius: 4px;
    padding: 16px;
    text-transform: none;
    display: flex;
    min-height: 100px;
    width: 100%;
    .row {
      display: flex;
      flex-direction: row;
      width: 100%;
    }
    .align-center {
      align-items: center;
    }
    .column {
      display: flex;
      flex-direction: column;
      text-align: start;
    }

    .title-container {
      margin-left: 10px;
      .title {
        ${(props) =>
          props.disabled
            ? `color: ${() => props.theme.palette.text.disabled};`
            : `color: ${() => props.theme.palette.background.default};`};
      }
      .desc {
        ${(props) =>
          props.disabled
            ? `color: ${() => props.theme.palette.text.disabled};`
            : `color: ${() => props.theme.palette.background.default};`};
      }
    }
  }
`;

export default ({
  icon: Icon,
  title,
  description,
  onClick,
  disabled,
  isBeta,
  ...props
}: Props & CypressButtonProps) => {
  return (
    <Container disabled={disabled} data-cy={props['data-cy']}>
      <Button
        data-cy={`${title}-service-button`}
        onClick={onClick}
        disabled={disabled}
      >
        <div className="row">
          <div className="column">
            <Icon />
          </div>
          <div className="column title-container">
            <div className="row align-center">
              <Typography variant="h6" className="title">
                {title}
              </Typography>
              <HorizontalSpacer size={8} />
              {isBeta && <BetaBadge />}
            </div>

            <Typography variant="body2" className="desc">
              {description}
            </Typography>
          </div>
        </div>
      </Button>
    </Container>
  );
};
