import * as R from 'ramda';
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
import { ArticleEditState } from '../Model';
import { createSourceNode } from '../../../../services/utils';

const MarkRow = ({
  index,
  state,
  label,
  dispatch,
}: {
  label: string;
  index: number;
  state: ArticleEditState;
  dispatch: React.Dispatch<ArticleEditState>;
}) => {
  const sentence = state.sentences[index];
  const [isPlaying, setIsPlaying] = useState(false);
  const sourseNodeRef = useRef<AudioBufferSourceNode | null>(null);

  const handleChangeMark = (value: number, isEnd?: boolean) => {
    const updatedState = R.assocPath<number, ArticleEditState>(
      ['sentences', index, isEnd ? 'end' : 'start'],
      value
    )(state);

    dispatch(updatedState);
  };

  const play = async (start: number, end: number) => {
    if (!state.audioContext || !state.blob) return;
    const sourceNode = await createSourceNode(state.blob, state.audioContext);

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
        <IconButton
          color='primary'
          onClick={() => handlePlay(sentence.start, sentence.end)}
        >
          {isPlaying ? <PauseIcon /> : <PlayArrowIcon />}
        </IconButton>
      </TableCell>
      <TableCell>{label}</TableCell>
      <TableCell sx={{ width: 80 }}>
        <TextField
          label='start'
          size='small'
          type='number'
          value={sentence.start}
          inputProps={{ step: 0.1 }}
          onChange={(e) => handleChangeMark(Number(e.target.value))}
        />
      </TableCell>
      <TableCell padding='none' width={'10%'}>
        <Button
          color='primary'
          size='small'
          onClick={() => handlePlay(sentence.end - 1, sentence.end)}
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
          value={sentence.end}
          onChange={(e) => handleChangeMark(Number(e.target.value), true)}
        />
      </TableCell>
    </TableRow>
  );
};

export default MarkRow;
