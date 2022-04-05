import { PlayArrow } from '@mui/icons-material';
import React, { useEffect, useState } from 'react';
import { IconButton, TableCell, TableRow, TextField } from '@mui/material';

const MarkRow = ({
  label,
  superEnd,
  superStart,
  handlePlayMarkRow,
  superHandleChangeEnd,
  superHandleChangeStart,
}: {
  label: string;
  superEnd: number;
  superStart: number;
  handlePlayMarkRow: () => void;
  superHandleChangeEnd: (value: number) => void;
  superHandleChangeStart: (value: number) => void;
}) => {
  const [end, setEnd] = useState(0);
  const [start, setStart] = useState(0);

  useEffect(() => {
    setStart(superStart);
  }, [superStart]);

  useEffect(() => {
    setEnd(superEnd);
  }, [superEnd]);

  const handlePlay = () => {
    handlePlayMarkRow();
  };

  const handleChangeEnd = (end: number) => {
    setEnd(end);
    superHandleChangeEnd(end);
  };

  const handleChangeStart = (start: number) => {
    setStart(start);
    superHandleChangeStart(start);
  };

  return (
    <TableRow>
      <TableCell padding='none'>
        <IconButton color='primary' onClick={() => handlePlay()}>
          <PlayArrow />
        </IconButton>
      </TableCell>
      <TableCell>{label}</TableCell>
      <TableCell sx={{ width: 80 }}>
        <TextField
          label='start'
          size='small'
          type='number'
          value={start}
          onChange={(e) => handleChangeStart(Number(e.target.value))}
        />
      </TableCell>
      <TableCell sx={{ width: 80 }}>
        <TextField
          label='end'
          size='small'
          type='number'
          value={end}
          onChange={(e) => handleChangeEnd(Number(e.target.value))}
        />
      </TableCell>
    </TableRow>
  );
};

export default MarkRow;
