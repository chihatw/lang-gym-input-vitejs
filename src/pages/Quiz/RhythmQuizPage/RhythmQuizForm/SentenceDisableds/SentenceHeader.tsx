import DeleteIcon from '@mui/icons-material/Delete';
import { IconButton, TextField } from '@mui/material';
import React from 'react';
import { RhythmQuizState } from '../../Model';
import { RhythmQuizAction, RhythmQuizActionTypes } from '../../Update';

const SentenceHeader = ({
  state,
  sentenceIndex,
  dispatch,
}: {
  state: RhythmQuizState;
  sentenceIndex: number;
  dispatch: React.Dispatch<RhythmQuizAction>;
}) => {
  const { audios, rhythmString, disabledsArray, rhythmArray } = state;
  const audio = audios[sentenceIndex];
  const { start, end } = audio;

  const handleDelete = () => {
    const rhythmStringLines = rhythmString.split('\n');
    rhythmStringLines.splice(sentenceIndex, 1);
    const clonedRhythmArray = [...rhythmArray];
    clonedRhythmArray.splice(sentenceIndex, 1);
    const clonedDisabledsArray = [...disabledsArray];
    clonedDisabledsArray.splice(sentenceIndex, 1);
    const clonedAudios = [...audios];
    clonedAudios.splice(sentenceIndex, 1);
    dispatch({
      type: RhythmQuizActionTypes.deleteLine,
      payload: {
        audios: clonedAudios,
        rhythmArray: clonedRhythmArray,
        rhythmString: rhythmStringLines.join('\n'),
        disabledsArray: clonedDisabledsArray,
      },
    });
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
          onChange={(e) =>
            dispatch({
              type: RhythmQuizActionTypes.changeStart,
              payload: { index: sentenceIndex, value: Number(e.target.value) },
            })
          }
        />
        <TextField
          inputProps={{ step: 0.1 }}
          type='number'
          size='small'
          value={end}
          label='end'
          onChange={(e) =>
            dispatch({
              type: RhythmQuizActionTypes.changeEnd,
              payload: { index: sentenceIndex, value: Number(e.target.value) },
            })
          }
        />
      </div>
      <IconButton size='small' onClick={handleDelete}>
        <DeleteIcon />
      </IconButton>
    </div>
  );
};

export default SentenceHeader;
