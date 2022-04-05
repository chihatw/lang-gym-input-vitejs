import React from 'react';
import { Table, TableBody } from '@mui/material';

import MarkRow from './MarkRow';
import { Mark } from '../../../../entities/Mark';

const MarkTable: React.FC<{
  marks: Mark[];
  labels: string[];
  handleChangeEnd: ({ index, end }: { index: number; end: number }) => void;
  handleChangeStart: ({
    index,
    start,
  }: {
    index: number;
    start: number;
  }) => void;
  handlePlayMarkRow: (value: number) => void;
}> = ({
  marks,
  labels,
  handleChangeEnd,
  handlePlayMarkRow,
  handleChangeStart,
}) => {
  return (
    <Table size='small'>
      <TableBody>
        {labels.map((label, index) => (
          <MarkRow
            key={index}
            label={label}
            superEnd={marks[index]?.end || 0}
            superStart={marks[index]?.start || 0}
            handlePlayMarkRow={() => handlePlayMarkRow(index)}
            superHandleChangeEnd={(end: number) =>
              handleChangeEnd({ index, end })
            }
            superHandleChangeStart={(start: number) =>
              handleChangeStart({ index, start })
            }
          />
        ))}
      </TableBody>
    </Table>
  );
};

export default MarkTable;
