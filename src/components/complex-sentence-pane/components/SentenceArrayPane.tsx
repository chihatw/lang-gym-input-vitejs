import React, { useContext } from 'react';
import { ComplexSentencePaneContext } from '../complex-sentence-pane';
import SentencePaneContainer from './SentencePaneContainer';

const SentenceArrayPane: React.FC<{
  sentenceArray: string[];
  sentenceArrayIndex: number;
}> = ({ sentenceArray, sentenceArrayIndex }) => {
  const { sentenceTexts, sentences } = useContext(ComplexSentencePaneContext);
  if (!!sentenceArray.length) {
    return (
      <div>
        <div style={{ color: '#777', fontSize: 10, padding: '0 2px 4px' }}>
          {sentenceTexts[sentenceArray[0]]}
        </div>
        {sentenceArray.map((sentenceId, index) => (
          <div key={index}>
            {sentences[sentenceId] && (
              <SentencePaneContainer
                sentenceId={sentenceId}
                sentenceArrayIndex={sentenceArrayIndex}
              />
            )}
            {!!sentenceArray[index + 1] && <div style={{ height: 8 }} />}
          </div>
        ))}
      </div>
    );
  } else {
    return <></>;
  }
};

export default SentenceArrayPane;
