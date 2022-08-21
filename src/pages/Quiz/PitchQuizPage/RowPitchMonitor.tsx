import React from 'react';
import string2PitchesArray from 'string2pitches-array';

import { PitchQuizFormState } from './Model';
import WordPitchMonitor from './WordPitchMonitor';
import AudioSlider from '../../../components/AudioSlider';

const RowPitchMonitor = ({
  state,
  dispatch,
  sentenceIndex,
}: {
  state: PitchQuizFormState;
  dispatch: React.Dispatch<PitchQuizFormState>;
  sentenceIndex: number;
}) => {
  const question = state.questions[sentenceIndex];
  const pitchesArray = string2PitchesArray(question.pitchStr);
  return (
    <div key={sentenceIndex}>
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <div style={{ paddingRight: 16 }}>{sentenceIndex}</div>
        {!!state.blob && !!state.audioContext && (
          <AudioSlider
            audioContext={state.audioContext}
            blob={state.blob}
            spacer={5}
            start={question.start}
            end={question.end}
          />
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
