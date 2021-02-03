import React, { ReactChild } from 'react';
import { Grid, GridSpacing } from '@material-ui/core';

type Props = {
  children: ReactChild | ReactChild[];
  layout: 'EVEN' | 'KEY_VALUE';
  responsive: boolean;
  spacing?: GridSpacing;
};

export default ({ children, layout, responsive, spacing }: Props) => {
  let firstElement: ReactChild | null = null;
  let secondElement: ReactChild | null = null;
  if (Array.isArray(children)) {
    [firstElement, secondElement] = children;
  } else {
    firstElement = children;
  }

  const leftSize = layout === 'EVEN' ? 6 : 5;
  const rightSize = layout === 'EVEN' ? 6 : 7;
  // the reason why not using spacing is -> we have Collapse which maybe empty, and it is wrapped with TwoColumns
  // with spacing will lead to extra empty space if Collapsed
  return (
    <Grid container spacing={spacing === undefined ? 2 : spacing}>
      <Grid item xs={responsive ? 12 : leftSize} md={leftSize}>
        {firstElement}
      </Grid>
      {secondElement && (
        <>
          <Grid item xs={responsive ? 12 : rightSize} md={rightSize}>
            {secondElement}
          </Grid>
        </>
      )}
    </Grid>
  );
};
