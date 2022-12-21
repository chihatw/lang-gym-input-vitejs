import React from 'react';
import string2PitchesArray from 'string2pitches-array';

import { PitchQuizFormState } from './Model';
import WordPitchMonitor from './WordPitchMonitor';
import AudioSlider from '../../../components/AudioSlider';
import StartForm from './StartForm';
import EndForm from './EndForm';

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
      <div style={{ display: 'flex', columnGap: 8 }}>
        <div style={{ paddingRight: 16 }}>{sentenceIndex}</div>
        {!!state.downloadURL && (
          <>
            <StartForm
              state={state}
              dispatch={dispatch}
              sentenceIndex={sentenceIndex}
            />
            <EndForm
              state={state}
              dispatch={dispatch}
              sentenceIndex={sentenceIndex}
            />
          </>
        )}
      </div>
      <div style={{ display: 'flex', alignItems: 'center' }}>
        {!!state.blob && !!state.audioContext && !!state.downloadURL && (
          <div style={{ flexGrow: 1 }}>
            <AudioSlider
              audioContext={state.audioContext}
              blob={state.blob}
              spacer={5}
              start={question.start}
              end={question.end}
            />
          </div>
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
