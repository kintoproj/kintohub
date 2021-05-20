import React, { useState } from 'react';

import FormControl, { FormControlProps } from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import OutlinedInput from '@material-ui/core/OutlinedInput';
import InputAdornment from '@material-ui/core/InputAdornment';
import IconButton from '@material-ui/core/IconButton';
import LinkIcon from '@material-ui/icons/LinkRounded';
import CopyToClipboard from 'react-copy-to-clipboard';
import styled from 'styled-components';
import Tooltip from '@material-ui/core/Tooltip';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';

const DivContainer = styled.div`
  .MuiTooltip-tooltip {
    white-space: pre-line;
  }
`;

export type Props = {
  label: string;
  value: string;
  displayValue?: string;
} & FormControlProps;

export default ({ label, value, displayValue, ...rest }: Props) => {
  const [open, setOpen] = useState(false);

  return (
    <DivContainer>
      <FormControl variant="outlined" {...rest}>
        <InputLabel shrink={true} htmlFor={`outlined-adornment-${label}`}>
          {label}
        </InputLabel>
        <OutlinedInput
          label={label}
          id={`outlined-adornment-${label}`}
          value={displayValue || value}
          notched={true}
          endAdornment={
            <InputAdornment position="end">
              <ClickAwayListener onClickAway={() => setOpen(false)}>
                <div>
                  <Tooltip
                    onClose={() => setOpen(false)}
                    open={open}
                    disableFocusListener
                    disableHoverListener
                    disableTouchListener
                    title={`${label}: ${
                      displayValue || value
                    } is copied to clipboard.`}
                  >
                    <CopyToClipboard
                      text={value}
                      onCopy={() => {
                        setOpen(true);
                      }}
                    >
                      <IconButton aria-label={value} edge="end">
                        <LinkIcon />
                      </IconButton>
                    </CopyToClipboard>
                  </Tooltip>
                </div>
              </ClickAwayListener>
            </InputAdornment>
          }
        />
      </FormControl>
    </DivContainer>
  );
};
