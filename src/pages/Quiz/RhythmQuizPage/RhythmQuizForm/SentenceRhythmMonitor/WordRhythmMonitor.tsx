import * as R from 'ramda';
import { Checkbox } from '@mui/material';
import React from 'react';
import { RhythmQuizFromState } from '../../Model';

const WordRhythmMonitor = ({
  state,
  wordIndex,
  sentenceIndex,
  dispatch,
}: {
  state: RhythmQuizFromState;
  wordIndex: number;
  sentenceIndex: number;
  dispatch: React.Dispatch<RhythmQuizFromState>;
}) => {
  const question = state.questions[sentenceIndex];
  const wordRhythm = question.syllables[wordIndex];
  const hasNext = wordIndex !== Object.values(question.syllables).length - 1;
  const isDisabled = question.disableds.includes(wordIndex);
  const handleCheck = () => {
    let updatedDiableds = [...question.disableds];
    if (isDisabled) {
      updatedDiableds = updatedDiableds.filter((item) => item !== wordIndex);
    } else {
      updatedDiableds.push(wordIndex);
    }
    const updatedState = R.compose(
      R.assocPath<number[], RhythmQuizFromState>(
        ['questions', sentenceIndex, 'disableds'],
        updatedDiableds
      )
    )(state);
    dispatch(updatedState);
  };
  return (
    <div style={{ display: 'flex' }}>
      <div style={{ border: '1px solid #eee', padding: '8px 8px 0' }}>
        <div style={{ display: 'flex' }}>
          {wordRhythm.map((syllable, syllableIndex) => (
            <div
              key={syllableIndex}
              style={{
                border: '1px solid #eee',
                padding: 8,
              }}
            >
              <div style={{ textAlign: 'center' }}>
                <span>{syllable.kana}</span>
                <span style={{ color: '#f50057' }}>
                  {syllable.longVowel || syllable.specialMora}
                </span>
              </div>
            </div>
          ))}
        </div>
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Checkbox size='small' checked={isDisabled} onClick={handleCheck} />
        </div>
      </div>
      {hasNext && <div style={{ width: 8 }} />}
    </div>
  );
};

export default WordRhythmMonitor;
