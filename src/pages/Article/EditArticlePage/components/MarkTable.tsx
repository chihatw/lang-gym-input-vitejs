import React from 'react';
import { Table, TableBody } from '@mui/material';

import MarkRow from './MarkRow';
import { Mark } from '../../../../Model';

const MarkTable: React.FC<{
  marks: Mark[];
  labels: string[];
  downloadURL: string;
  setCurrentTime: (value: number) => void;
  handleChangeEnd: ({ index, end }: { index: number; end: number }) => void;
  handleChangeStart: ({
    index,
    start,
  }: {
    index: number;
    start: number;
  }) => void;
}> = ({
  marks,
  labels,
  downloadURL,
  setCurrentTime,
  handleChangeEnd,
  handleChangeStart,
}) => {
  return (
    <Table size='small'>
      <TableBody>
        {labels.map((label, index) => (
          <MarkRow
            key={index}
            label={label}
            downloadURL={downloadURL}
            superEnd={marks[index]?.end || 0}
            superStart={marks[index]?.start || 0}
            setCurrentTime={setCurrentTime}
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
