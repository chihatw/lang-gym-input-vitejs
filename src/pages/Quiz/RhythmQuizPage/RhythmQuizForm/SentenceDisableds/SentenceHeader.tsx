import DeleteIcon from '@mui/icons-material/Delete';
import { IconButton, TextField } from '@mui/material';
import React from 'react';
import { RhythmQuizFromState } from '../../Model';

const SentenceHeader = ({
  state,
  sentenceIndex,
  dispatch,
}: {
  state: RhythmQuizFromState;
  sentenceIndex: number;
  dispatch: React.Dispatch<RhythmQuizFromState>;
}) => {
  const start = state.starts[sentenceIndex];
  const end = state.ends[sentenceIndex];

  const handleChangeStart = (start: number) => {
    const updatedStarts = [...state.starts];
    updatedStarts.splice(sentenceIndex, 1, start);
    const updatedState: RhythmQuizFromState = {
      ...state,
      starts: updatedStarts,
    };
    dispatch(updatedState);
  };

  const handleChangeEnd = (end: number) => {
    const updatedEnds = [...state.ends];
    updatedEnds.splice(sentenceIndex, 1, end);
    const updatedState: RhythmQuizFromState = {
      ...state,
      ends: updatedEnds,
    };
    dispatch(updatedState);
  };

  const handleDelete = () => {
    const updatedrhythmStringLines = state.rhythmString.split('\n');
    updatedrhythmStringLines.splice(sentenceIndex, 1);

    const updatedRhythmArray = [...state.rhythmArray];
    updatedRhythmArray.splice(sentenceIndex, 1);

    const updatedStarts = [...state.starts];
    updatedStarts.splice(sentenceIndex, 1);

    const updatedEnds = [...state.ends];
    updatedEnds.splice(sentenceIndex, 1);

    const updatedState: RhythmQuizFromState = {
      ...state,
      rhythmString: updatedrhythmStringLines.join('\n'),
      rhythmArray: updatedRhythmArray,
      starts: updatedStarts,
      ends: updatedEnds,
    };
    dispatch(updatedState);
  };
  return (
    <div style={{ display: 'flex', alignItems: 'center', columnGap: 16 }}>
      <div>{sentenceIndex + 1}</div>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '80px 80px 80px',
          columnGap: 8,
        }}
      >
        <TextField
          inputProps={{ step: 0.1 }}
          type='number'
          size='small'
          value={start}
          label='start'
          onChange={(e) => handleChangeStart(Number(e.target.value))}
        />
        <TextField
          inputProps={{ step: 0.1 }}
          type='number'
          size='small'
          value={end}
          label='end'
          onChange={(e) => handleChangeEnd(Number(e.target.value))}
        />
      </div>
      <IconButton size='small' onClick={handleDelete}>
        <DeleteIcon />
      </IconButton>
    </div>
  );
};

export default SentenceHeader;
