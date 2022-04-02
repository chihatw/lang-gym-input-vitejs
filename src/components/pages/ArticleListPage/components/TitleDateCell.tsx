import { TableCell } from '@mui/material';
import React, { useMemo } from 'react';

const TitleDateCell = ({
  title,
  createdAt,
}: {
  title: string;
  createdAt: number;
}) => {
  const dayString = useMemo(() => {
    const date = new Date(createdAt);
    return `${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()}`;
  }, [createdAt]);
  return (
    <TableCell>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '120px auto',
        }}
      >
        <div
          style={{
            overflow: 'hidden',
            whiteSpace: 'nowrap',
            textOverflow: 'ellipsis',
          }}
        >
          {title}
        </div>
        <div>{dayString}</div>
      </div>
    </TableCell>
  );
};

export default TitleDateCell;
