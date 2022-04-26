import React, { useContext } from 'react';
import SentenceRhythm from './SentenceRhythm';
import { RhythmsQuestionPageContext } from '../services/rhythmsQuestionPage';
import { Question } from '../../../../../services/useQuestions';

const RhythmsMonitor = ({ questions }: { questions: Question[] }) => {
  const { disabledsArray } = useContext(RhythmsQuestionPageContext);
  return (
    <div style={{ fontSize: 12, color: '#555', display: 'grid', rowGap: 16 }}>
      {disabledsArray.map((_, sentenceIndex) => {
        return (
          <SentenceRhythm
            sentenceIndex={sentenceIndex}
            key={sentenceIndex}
            question={questions[sentenceIndex]}
          />
        );
      })}
    </div>
  );
};

export default RhythmsMonitor;
