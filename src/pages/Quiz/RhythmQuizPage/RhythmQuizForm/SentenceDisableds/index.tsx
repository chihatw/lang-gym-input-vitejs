import React from 'react';
import AudioSlider from '../../../../../components/AudioSlider';
import { RhythmQuizState } from '../../Model';
import { RhythmQuizAction } from '../../Update';
import SentenceHeader from './SentenceHeader';
import SyllableDisable from './SyllableDisable';

const SentenceDisableds = ({
  sentenceIndex,
  state,
  dispatch,
}: {
  state: RhythmQuizState;
  dispatch: React.Dispatch<RhythmQuizAction>;
  sentenceIndex: number;
}) => {
  const { rhythmArray, quizBlob, audioContext, audios } = state;

  const sentenceRhythm = rhythmArray[sentenceIndex];
  const audio = audios[sentenceIndex];
  const { start, end } = audio;

  return (
    <div style={{ display: 'grid', rowGap: 16 }}>
      <SentenceHeader
        state={state}
        dispatch={dispatch}
        sentenceIndex={sentenceIndex}
      />
      {!!audioContext && !!quizBlob && (
        <AudioSlider
          audioContext={audioContext}
          blob={quizBlob}
          spacer={5}
          start={start}
          end={end}
        />
      )}

      <div style={{ border: '1px solid #eee', borderRadius: 4, padding: 8 }}>
        <div style={{ display: 'flex', flexWrap: 'wrap' }}>
          {sentenceRhythm.map((wordRhythm, wordIndex) => (
            <div key={wordIndex}>
              <div style={{ display: 'flex' }}>
                <div style={{ border: '1px solid #eee', padding: 8 }}>
                  <div style={{ display: 'flex' }}>
                    {wordRhythm.map((_, syllableIndex) => (
                      <SyllableDisable
                        key={syllableIndex}
                        sentenceIndex={sentenceIndex}
                        wordIndex={wordIndex}
                        syllableIndex={syllableIndex}
                        state={state}
                        dispatch={dispatch}
                      />
                    ))}
                  </div>
                </div>
                {wordIndex !== sentenceRhythm.length - 1 && (
                  <div style={{ width: 8 }} />
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SentenceDisableds;
