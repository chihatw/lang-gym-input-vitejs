import PauseIcon from '@mui/icons-material/Pause';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import React, { useEffect, useMemo, useState } from 'react';
import {
  Button,
  IconButton,
  TableCell,
  TableRow,
  TextField,
} from '@mui/material';

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
  const handleClickPlayTail = () => {
    audioElement.currentTime = end - 1;
    audioElement.ontimeupdate = () => {
      setCurrentTime(audioElement.currentTime);
      if (audioElement.currentTime > end) {
        audioElement.pause();
        setIsPlaying(false);
      }
    };
    audioElement.play();
  };
  return (
    <TableRow>
      <TableCell padding='none'>
        <IconButton color='primary' onClick={handleClickPlay}>
          {isPlaying ? <PauseIcon /> : <PlayArrowIcon />}
        </IconButton>
      </TableCell>
      <TableCell>{label}</TableCell>
      <TableCell sx={{ width: 80 }}>
        <TextField
          label='start'
          size='small'
          type='number'
          value={start}
          inputProps={{ step: 0.1 }}
          onChange={(e) => handleChangeStart(Number(e.target.value))}
        />
      </TableCell>
      <TableCell padding='none' width={'10%'}>
        <Button color='primary' size='small' onClick={handleClickPlayTail}>
          -1.0
        </Button>
      </TableCell>
      <TableCell sx={{ width: 80 }}>
        <TextField
          label='end'
          size='small'
          type='number'
          inputProps={{ step: 0.1 }}
          value={end}
          onChange={(e) => handleChangeEnd(Number(e.target.value))}
        />
      </TableCell>
    </TableRow>
  );
};

export default MarkRow;
