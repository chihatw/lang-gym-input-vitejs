import { Checkbox } from '@mui/material';
import React, { useContext } from 'react';
import { RhythmsQuestionPageContext } from '../services/rhythmsQuestionPage';
import SyllableRhythm from './SyllableRhythm';

const WordRhythm: React.FC<{
  wordIndex: number;
  sentenceIndex: number;
}> = ({ wordIndex, sentenceIndex }) => {
  const { onChangeWordDisabled, disabledsArray, sentenceRhythmArray } =
    useContext(RhythmsQuestionPageContext);

  const wordRhythm = sentenceRhythmArray[sentenceIndex][wordIndex];

  const sentenceDisableds = disabledsArray[sentenceIndex];
  const hasWirdDisabled = !!sentenceDisableds[wordIndex];

  const wordDisabledsCount = hasWirdDisabled
    ? sentenceDisableds[wordIndex].filter((s) => !!s).length
    : 0;

  const isWordIndeterminate =
    wordDisabledsCount > 0 && wordDisabledsCount < wordRhythm.length;
  const isWordDisabled = wordDisabledsCount === wordRhythm.length;

  return (
    <div style={{ border: '1px solid #eee', padding: 8 }}>
      <div style={{ display: 'flex' }}>
        {wordRhythm.map((syllableRhythm, syllableIndex) => (
          <div key={syllableIndex}>
            <SyllableRhythm
              sentenceIndex={sentenceIndex}
              wordIndex={wordIndex}
              syllableIndex={syllableIndex}
            />
          </div>
        ))}
      </div>
      <Checkbox
        size='small'
        color='primary'
        indeterminate={isWordIndeterminate}
        checked={isWordDisabled}
        onChange={() => onChangeWordDisabled(sentenceIndex, wordIndex)}
      />
    </div>
  );
};

export default WordRhythm;
