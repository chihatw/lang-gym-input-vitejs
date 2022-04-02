import { IconButton, TableCell } from '@mui/material';
import React from 'react';
import { useNavigate } from 'react-router-dom';

const LinkIconCell = ({
  icon,
  pathname,
  disabled,
}: {
  icon: React.ReactElement;
  pathname: string;
  disabled?: boolean;
}) => {
  const navigate = useNavigate();
  return (
    <TableCell padding='none'>
      <IconButton
        size='small'
        onClick={() => navigate(pathname)}
        disabled={disabled}
      >
        {icon}
      </IconButton>
    </TableCell>
  );
};

export default LinkIconCell;
