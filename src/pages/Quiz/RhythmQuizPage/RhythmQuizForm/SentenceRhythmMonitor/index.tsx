import React from 'react';
import AudioSlider from '../../../../../components/AudioSlider';
import { RhythmQuizFromState } from '../../Model';
import SentenceHeader from './SentenceHeader';
import WordRhythmMonitor from './WordRhythmMonitor';

const SentenceRhythmMonitor = ({
  state,
  sentenceIndex,
  dispatch,
}: {
  state: RhythmQuizFromState;
  dispatch: React.Dispatch<RhythmQuizFromState>;
  sentenceIndex: number;
}) => {
  const question = state.questions[sentenceIndex];
  return (
    <div style={{ display: 'grid', rowGap: 16 }}>
      <SentenceHeader
        state={state}
        dispatch={dispatch}
        sentenceIndex={sentenceIndex}
      />
      {!!state.audioContext && !!state.blob && (
        <AudioSlider
          audioContext={state.audioContext}
          blob={state.blob}
          spacer={5}
          start={question.start}
          end={question.end}
        />
      )}

      <div style={{ border: '1px solid #eee', borderRadius: 4, padding: 8 }}>
        <div style={{ display: 'flex', flexWrap: 'wrap' }}>
          {Object.keys(question.syllables).map((_, wordIndex) => (
            <div key={wordIndex}>
              <WordRhythmMonitor
                state={state}
                wordIndex={wordIndex}
                sentenceIndex={sentenceIndex}
                dispatch={dispatch}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SentenceRhythmMonitor;
