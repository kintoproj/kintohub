import React, { useState } from 'react';
import CopyToClipboard from 'react-copy-to-clipboard';

import { ClickAwayListener, Tooltip } from '@material-ui/core';
import { ButtonProps } from '@material-ui/core/Button';
import Button from 'components/atoms/Button';
import { CypressButtonProps } from 'types/cypress';

type Props = {
  label: string;
  value: string;
  displayValue?: string;
} & ButtonProps &
  CypressButtonProps;

export default ({ value, label, displayValue, ...rest }: Props) => {
  const [open, setOpen] = useState(false);
  return (
    <ClickAwayListener onClickAway={() => setOpen(false)}>
      <>
        <Tooltip
          onClose={() => setOpen(false)}
          open={open}
          disableFocusListener
          disableHoverListener
          disableTouchListener
          title={`${displayValue || value} is copied to clipboard.`}
        >
          <CopyToClipboard
            text={value}
            onCopy={() => {
              setOpen(true);
            }}
          >
            <Button {...rest}>{label}</Button>
          </CopyToClipboard>
        </Tooltip>
      </>
    </ClickAwayListener>
  );
};
