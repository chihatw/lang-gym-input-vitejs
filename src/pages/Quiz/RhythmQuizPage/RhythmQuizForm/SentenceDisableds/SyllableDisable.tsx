import { Checkbox } from '@mui/material';
import React from 'react';
import { RhythmQuizFromState } from '../../Model';

const SyllableDisabled = ({
  state,
  sentenceIndex,
  wordIndex,
  syllableIndex,
  dispatch,
}: {
  state: RhythmQuizFromState;
  sentenceIndex: number;
  wordIndex: number;
  syllableIndex: number;
  dispatch: React.Dispatch<RhythmQuizFromState>;
}) => {
  const { rhythmArray } = state;
  const wordRhythm = rhythmArray[sentenceIndex][wordIndex];
  const syllableRhythm = wordRhythm[syllableIndex];
  const { longVowel, specialMora, kana } = syllableRhythm;
  const isDisabled =
    !!rhythmArray[sentenceIndex][wordIndex][syllableIndex].disabled;

  const handleChange = () => {
    let _specialMora = '';
    if (!isDisabled) {
      _specialMora = specialMora || 'x';
    }

    const updatedRhythmArray = [...state.rhythmArray];

    updatedRhythmArray[sentenceIndex][wordIndex][syllableIndex].disabled =
      _specialMora;

    const updatedState: RhythmQuizFromState = {
      ...state,
      rhythmArray: updatedRhythmArray,
    };
    dispatch(updatedState);
  };

  return (
    <div
      style={{
        border: '1px solid #eee',
        padding: 8,
      }}
    >
      <div style={{ textAlign: 'center' }}>
        <span>{kana}</span>
        <span style={{ color: '#f50057' }}>{longVowel || specialMora}</span>
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
