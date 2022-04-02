import React, { useMemo } from 'react'; // useState

import sentenceParseNew2SentenceParseProps from 'sentence-parse-new2sentence-parse-props';

import { SentenceParseNew } from '../../../../entities/SentenceParseNew';
import { ComplexSentencePane } from '../../../../components/complex-sentence-pane';

const ComplexSentenceDrawerWrapper: React.FC<{
  sentenceParseNew: SentenceParseNew;
}> = ({ sentenceParseNew }) => {
  const { units, sentences, sentenceArrays } = useMemo(
    () =>
      sentenceParseNew2SentenceParseProps({
        words: sentenceParseNew.words,
        units: sentenceParseNew.units,
        branches: sentenceParseNew.branches,
        sentences: sentenceParseNew.sentences,
        sentenceArrays: sentenceParseNew.sentenceArrays,
      }),
    [sentenceParseNew]
  );
  return (
    <ComplexSentencePane
      Cursor={null}
      units={units}
      sentences={sentences}
      sentenceArrays={sentenceArrays}
    />
  );
};

export default ComplexSentenceDrawerWrapper;
