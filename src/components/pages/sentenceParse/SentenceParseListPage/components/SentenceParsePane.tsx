import React from 'react';
import { SentenceParseNew } from '../../../../../entities/SentenceParseNew';
import ComplexSentenceDrawerWrapper from './ComplexSentenceDrawerWrapper';

const SentenceParsePane: React.FC<{
  sentenceParseNew: SentenceParseNew;
}> = ({ sentenceParseNew }) => {
  return (
    <div style={{ position: 'relative' }}>
      <div>
        {<ComplexSentenceDrawerWrapper sentenceParseNew={sentenceParseNew} />}
      </div>
    </div>
  );
};

export default SentenceParsePane;
