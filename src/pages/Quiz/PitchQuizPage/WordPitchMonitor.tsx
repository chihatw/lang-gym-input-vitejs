import * as R from 'ramda';
import React from 'react';

import { Checkbox } from '@mui/material';
import { PitchLine } from '@chihatw/pitch-line.pitch-line';
import string2PitchesArray from 'string2pitches-array';

import { PitchQuizFormState } from './Model';

const WordPitchMonitor = ({
  state,
  dispatch,
  sentenceIndex,
  wordIndex,
}: {
  state: PitchQuizFormState;
  dispatch: React.Dispatch<PitchQuizFormState>;
  sentenceIndex: number;
  wordIndex: number;
}) => {
  const question = state.questions[sentenceIndex];
  const isDisable = question.disableds.includes(wordIndex);
  const pitchesArray = string2PitchesArray(question.pitchStr);
  const pitches = pitchesArray[wordIndex];

  const handleCheckDisabled = () => {
    let updatedDisableds = [...question.disableds];

    // チェックを外す
    if (updatedDisableds.includes(wordIndex)) {
      updatedDisableds = updatedDisableds.filter((i) => i !== wordIndex);
    } else {
      // チェックをつける
      updatedDisableds.push(wordIndex);
    }
    const updatedState = R.compose(
      R.assocPath<number[], PitchQuizFormState>(
        ['questions', sentenceIndex, 'disableds'],
        updatedDisableds
      )
    )(state);
    dispatch(updatedState);
  };
  return (
    <div
      key={wordIndex}
      style={{
        padding: '8px 16px',
        borderRadius: 4,
        backgroundColor: isDisable ? '#eee' : 'transparent',
      }}
    >
      <PitchLine pitches={pitches} />
      <Checkbox
        size='small'
        color='primary'
        checked={isDisable}
        onChange={handleCheckDisabled}
      />
    </div>
  );
};

export default WordPitchMonitor;
