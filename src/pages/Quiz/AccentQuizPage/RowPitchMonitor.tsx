import React from 'react';
import VolumeOffIcon from '@mui/icons-material/VolumeOff';
import string2PitchesArray from 'string2pitches-array';

import Speaker from '../../../components/Speaker';
import { AccentQuizFormState } from './Model';
import WordPitchMonitor from './WordPitchMonitor';

const RowPitchMonitor = ({
  state,
  dispatch,
  sentenceIndex,
}: {
  state: AccentQuizFormState;
  dispatch: React.Dispatch<AccentQuizFormState>;
  sentenceIndex: number;
}) => {
  const line = state.pitchStr.split('\n')[sentenceIndex];
  const pitchesArray = string2PitchesArray(line);
  return (
    <div key={sentenceIndex}>
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <div style={{ paddingRight: 16 }}>{sentenceIndex}</div>
        {!!state.downloadURL ? (
          <Speaker
            start={state.starts[sentenceIndex]}
            end={state.ends[sentenceIndex]}
            downloadURL={state.downloadURL}
          />
        ) : (
          <VolumeOffIcon color='primary' />
        )}
      </div>
      <div style={{ display: 'flex', flexWrap: 'wrap' }}>
        {pitchesArray.map((_, wordIndex) => (
          <WordPitchMonitor
            key={wordIndex}
            state={state}
            dispatch={dispatch}
            sentenceIndex={sentenceIndex}
            wordIndex={wordIndex}
          />
        ))}
      </div>
    </div>
  );
};

export default RowPitchMonitor;
