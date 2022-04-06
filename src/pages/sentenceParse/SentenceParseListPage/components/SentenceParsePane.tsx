import React from 'react';
import { SentenceParseNew } from '../../../../services/useSentenceParseNews';

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
