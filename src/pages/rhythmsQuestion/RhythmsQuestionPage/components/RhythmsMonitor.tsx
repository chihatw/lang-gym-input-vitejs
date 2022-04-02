import React, { useContext } from 'react';
import SentenceRhythm from './SentenceRhythm';
import { RhythmsQuestionPageContext } from '../services/rhythmsQuestionPage';

const RhythmsMonitor = () => {
  const { disabledsArray } = useContext(RhythmsQuestionPageContext);
  return (
    <div style={{ fontSize: 12, color: '#555' }}>
      {disabledsArray.map((_, sentenceIndex) => {
        return (
          <div key={sentenceIndex}>
            <SentenceRhythm sentenceIndex={sentenceIndex} />
            {sentenceIndex !== disabledsArray.length - 1 && (
              <div style={{ height: 8 }} />
            )}
          </div>
        );
      })}
    </div>
  );
};

export default RhythmsMonitor;
