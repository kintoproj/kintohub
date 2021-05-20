import React from 'react';
import Typography from '@material-ui/core/Typography';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';

interface Props {
  text: string;
  colSpan?: number;
}

export default ({ text, colSpan }: Props) => {
  return (
    <TableRow>
      <TableCell align="center" colSpan={colSpan}>
        <Typography variant="body2" color="textSecondary">
          {text}
        </Typography>
      </TableCell>
    </TableRow>
  );
};
