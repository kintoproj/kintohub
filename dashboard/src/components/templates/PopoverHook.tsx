import React, { ReactNode } from 'react';
import {
  Divider,
  List,
  ListItem,
  Typography,
  IconProps,
} from '@material-ui/core';
import Popover, { PopoverOrigin } from '@material-ui/core/Popover';
import { HorizontalSpacer } from 'components/atoms/Spacer';
import styled from 'styled-components';
import { BetaText } from 'components/atoms/BetaBadge';
import { SeparatedRow } from 'components/atoms/Row';

export type PopoverAction =
  | {
      label: string;
      icon?: React.ComponentType;
      onClick: Function;
      disabled?: boolean;
      isBeta?: boolean;
    }
  | undefined;

type Props = {
  actions: PopoverAction[];
  id?: string;
  anchorOrigin?: PopoverOrigin;
  transformOrigin?: PopoverOrigin;
  onClose?: () => void;
};

const StyledDiv = styled.div`
  .MuiSvgIcon-root {
    color: ${(props) => props.theme.palette.text.secondary};
  }

  .align-center {
    align-items: center;
  }
`;

const renderIcon = (Icon: React.ComponentType<IconProps>) => {
  return <Icon fontSize="small" />;
};

// custom hooks
export const usePopover = ({
  actions,
  id,
  anchorOrigin,
  transformOrigin,
  onClose,
}: Props): [
  ReactNode,
  (event: React.MouseEvent<HTMLButtonElement>) => void
] => {
  const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(
    null
  );
  const popOpened = !!anchorEl;
  const popOverId = popOpened ? id || 'simple-popover' : undefined;

  const open = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const node = (
    <Popover
      id={popOverId}
      open={popOpened}
      anchorEl={anchorEl}
      onClose={() => {
        setAnchorEl(null);
        if (onClose) {
          onClose();
        }
      }}
      anchorOrigin={{
        vertical: 'top',
        horizontal: 'right',
        ...anchorOrigin,
      }}
      transformOrigin={{
        vertical: 'top',
        horizontal: 'left',
        ...transformOrigin,
      }}
    >
      <List>
        {actions.map((action, i) => (
          <StyledDiv key={`${action?.label}-${i}` || `divider-${i}`}>
            {action ? (
              <ListItem
                button
                onClick={(evt) => {
                  action.onClick();
                  setAnchorEl(null);
                }}
                disabled={action.disabled}
              >
                {action.icon && (
                  <>
                    {renderIcon(action.icon)}
                    <HorizontalSpacer size={16} />
                  </>
                )}
                <SeparatedRow className="align-center">
                  <Typography variant="body2">{action.label}</Typography>
                  {action.isBeta && (
                    <>
                      <HorizontalSpacer size={8} />
                      <BetaText />
                    </>
                  )}
                </SeparatedRow>
              </ListItem>
            ) : (
              <Divider />
            )}
          </StyledDiv>
        ))}
      </List>
    </Popover>
  );
  return [node, open];
};
