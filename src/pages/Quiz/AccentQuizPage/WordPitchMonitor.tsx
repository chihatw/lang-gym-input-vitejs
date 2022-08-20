import React from 'react';

import { Checkbox } from '@mui/material';
import { PitchLine } from '@chihatw/pitch-line.pitch-line';
import string2PitchesArray from 'string2pitches-array';

import { AccentQuizFormState } from './Model';

const WordPitchMonitor = ({
  state,
  dispatch,
  sentenceIndex,
  wordIndex,
}: {
  state: AccentQuizFormState;
  dispatch: React.Dispatch<AccentQuizFormState>;
  sentenceIndex: number;
  wordIndex: number;
}) => {
  const isDisable = state.disabledsArray[sentenceIndex]
    ? state.disabledsArray[sentenceIndex].includes(wordIndex)
    : false;
  const line = state.pitchStr.split('\n')[sentenceIndex];
  if (!line) return <></>;
  const pitchesArray = string2PitchesArray(line);
  const pitches = pitchesArray[wordIndex];
  const handleCheckDisabled = () => {
    let updatedDisabledsArray = [...state.disabledsArray];
    let sentenceDisableds = state.disabledsArray[sentenceIndex]
      ? [...state.disabledsArray[sentenceIndex]]
      : [];

    // チェックを外す
    if (sentenceDisableds.includes(wordIndex)) {
      sentenceDisableds = sentenceDisableds.filter((i) => i !== wordIndex);
    } else {
      // チェックをつける
      sentenceDisableds.push(wordIndex);
    }
    updatedDisabledsArray.splice(sentenceIndex, 1, sentenceDisableds);
    const updatedState: AccentQuizFormState = {
      ...state,
      disabledsArray: updatedDisabledsArray,
    };
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
