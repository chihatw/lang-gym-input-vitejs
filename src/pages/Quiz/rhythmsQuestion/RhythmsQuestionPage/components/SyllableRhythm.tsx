import { Checkbox } from '@mui/material';
import React, { useContext } from 'react';
import { RhythmsQuestionPageContext } from '../services/rhythmsQuestionPage';

const SyllableRhythm: React.FC<{
  wordIndex: number;
  sentenceIndex: number;
  syllableIndex: number;
}> = ({ sentenceIndex, wordIndex, syllableIndex }) => {
  const { onChangeDisabled, disabledsArray, sentenceRhythmArray } = useContext(
    RhythmsQuestionPageContext
  );
  const wordRhythm = sentenceRhythmArray[sentenceIndex][wordIndex];
  const syllableRhythm = wordRhythm[syllableIndex];
  const isDisabled = !!disabledsArray[sentenceIndex][wordIndex][syllableIndex];

  return (
    <div
      style={{
        border: '1px solid #eee',
        padding: 8,
      }}
    >
      <div style={{ textAlign: 'center' }}>
        <span>{syllableRhythm.syllable}</span>
        <span style={{ color: '#f50057' }}>
          {!!syllableRhythm.longVowel
            ? syllableRhythm.longVowel
            : syllableRhythm.mora}
        </span>
      </div>
      <Checkbox
        size='small'
        color='primary'
        checked={isDisabled}
        onChange={() =>
          onChangeDisabled(sentenceIndex, wordIndex, syllableIndex)
        }
      />
    </div>
  );
};

export default SyllableRhythm;
