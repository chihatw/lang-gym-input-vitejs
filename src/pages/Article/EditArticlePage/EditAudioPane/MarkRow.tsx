import PauseIcon from '@mui/icons-material/Pause';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import React, { useRef, useState } from 'react';
import {
  Button,
  IconButton,
  TableCell,
  TableRow,
  TextField,
} from '@mui/material';
import { ArticleVoiceState } from '../Model';
import { createSourceNode } from '../../../../services/utils';
import { buildSentenceLines } from '../../../../services/wave';
import { Mark } from '../../../../Model';

const MarkRow = ({
  index,
  state,
  dispatch,
}: {
  index: number;
  state: ArticleVoiceState;
  dispatch: React.Dispatch<ArticleVoiceState>;
}) => {
  const { labels, marks, articleBlob, audioContext, scale } = state;
  const label: string = labels[index] || '';
  const mark: Mark = marks[index] || { start: 0, end: 0 };
  const { start, end } = mark;
  const [isPlaying, setIsPlaying] = useState(false);
  const sourseNodeRef = useRef<AudioBufferSourceNode | null>(null);

  const handleMark = (value: number, isEnd?: boolean) => {
    const newMark = isEnd ? { end: value, start } : { end, start: value };
    const newMarks = [...marks];
    newMarks.splice(index, 1, newMark);
    const sentenceLines = buildSentenceLines({
      marks: newMarks,
      scale,
    });

    const updatedState: ArticleVoiceState = {
      ...state,
      sentenceLines,
      marks: newMarks,
    };

    dispatch(updatedState);
  };

  const play = async (start: number, end: number) => {
    if (!audioContext || !articleBlob) return;
    const sourceNode = await createSourceNode(articleBlob, audioContext);

    // 停止された場合
    sourceNode.onended = () => setIsPlaying(false);

    const duration = end - start;
    sourceNode.start(0, start, duration);
    setIsPlaying(true);
    sourseNodeRef.current = sourceNode;
  };

  const pause = () => {
    const sourceNode = sourseNodeRef.current;
    sourceNode && sourceNode.stop(0);
    // AudioBufferSourceNodeは使い捨て
    sourseNodeRef.current = null;
    setIsPlaying(false);
  };

  const handlePlay = (start: number, end: number) => {
    isPlaying ? pause() : play(start, end);
  };

  return (
    <TableRow>
      <TableCell padding='none'>
        <IconButton color='primary' onClick={() => handlePlay(start, end)}>
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
          onChange={(e) => handleMark(Number(e.target.value))}
        />
      </TableCell>
      <TableCell padding='none' width={'10%'}>
        <Button
          color='primary'
          size='small'
          onClick={() => handlePlay(end - 1, end)}
        >
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
          onChange={(e) => handleMark(Number(e.target.value), true)}
        />
      </TableCell>
    </TableRow>
  );
};

export default MarkRow;
