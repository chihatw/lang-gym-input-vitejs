import React from 'react';
import { IconButton, TableCell } from '@mui/material';

const IconButtonCell = ({
  icon,
  disabled,
  onClick,
}: {
  icon: React.ReactElement;
  disabled?: boolean;
  onClick: () => void;
}) => {
  return (
    <TableCell padding='none'>
      <IconButton size='small' onClick={onClick} disabled={disabled}>
        {icon}
      </IconButton>
    </TableCell>
  );
};

export default IconButtonCell;
