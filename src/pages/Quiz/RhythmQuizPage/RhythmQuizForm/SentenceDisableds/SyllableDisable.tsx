import { Checkbox } from '@mui/material';
import React from 'react';
import { RhythmQuizState } from '../../Model';
import { RhythmQuizAction, RhythmQuizActionTypes } from '../../Update';

const SyllableDisabled = ({
  state,
  sentenceIndex,
  wordIndex,
  syllableIndex,
  dispatch,
}: {
  state: RhythmQuizState;
  sentenceIndex: number;
  wordIndex: number;
  syllableIndex: number;
  dispatch: React.Dispatch<RhythmQuizAction>;
}) => {
  const { rhythmArray, disabledsArray } = state;
  const wordRhythm = rhythmArray[sentenceIndex][wordIndex];
  const syllableRhythm = wordRhythm[syllableIndex];
  const { longVowel, mora, syllable } = syllableRhythm;
  const isDisabled = !!disabledsArray[sentenceIndex][wordIndex][syllableIndex];

  const handleChange = () => {
    let specialMora = '';
    if (!isDisabled) {
      specialMora = mora || 'x';
    }
    dispatch({
      type: RhythmQuizActionTypes.changeDisabled,
      payload: { sentenceIndex, wordIndex, syllableIndex, specialMora },
    });
  };

  return (
    <div
      style={{
        border: '1px solid #eee',
        padding: 8,
      }}
    >
      <div style={{ textAlign: 'center' }}>
        <span>{syllable}</span>
        <span style={{ color: '#f50057' }}>{longVowel || mora}</span>
      </div>
      <Checkbox
        size='small'
        color='primary'
        checked={isDisabled}
        onChange={handleChange}
      />
    </div>
  );
};

export default SyllableDisabled;
