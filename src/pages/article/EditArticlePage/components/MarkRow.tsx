import { Pause, PlayArrow } from '@mui/icons-material';
import React, { useEffect, useMemo, useState } from 'react';
import { IconButton, TableCell, TableRow, TextField } from '@mui/material';

const MarkRow = ({
  label,
  superEnd,
  superStart,
  downloadURL,
  setCurrentTime,
  superHandleChangeEnd,
  superHandleChangeStart,
}: {
  label: string;
  superEnd: number;
  superStart: number;
  downloadURL: string;
  setCurrentTime: (value: number) => void;
  superHandleChangeEnd: (value: number) => void;
  superHandleChangeStart: (value: number) => void;
}) => {
  const [end, setEnd] = useState(0);
  const [start, setStart] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  const audioElement = useMemo(() => new Audio(downloadURL), [downloadURL]);

  useEffect(() => {
    return () => {
      audioElement.pause();
    };
  }, [audioElement]);

  useEffect(() => {
    setStart(superStart);
  }, [superStart]);

  useEffect(() => {
    setEnd(superEnd);
  }, [superEnd]);

  const handleChangeEnd = (end: number) => {
    setEnd(end);
    superHandleChangeEnd(end);
  };

  const handleChangeStart = (start: number) => {
    setStart(start);
    superHandleChangeStart(start);
  };

  const handleClickPlay = () => {
    setIsPlaying(!isPlaying);
    if (!isPlaying) {
      audioElement.currentTime = start;
      audioElement.ontimeupdate = () => {
        setCurrentTime(audioElement.currentTime);
        if (audioElement.currentTime > end) {
          audioElement.pause();
          setIsPlaying(false);
        }
      };
      audioElement.play();
    } else {
      audioElement.pause();
    }
  };

  return (
    <TableRow>
      <TableCell padding='none'>
        <IconButton color='primary' onClick={handleClickPlay}>
          {isPlaying ? <Pause /> : <PlayArrow />}
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
