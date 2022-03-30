import React, { useContext } from 'react';
import { ComplexSentencePaneContext } from '../complex-sentence-pane';
import SentenceArrayPane from './SentenceArrayPane';

const SubSentenceArrayPane: React.FC<{
  sentenceArray: string[];
  sentenceArrayIndex: number;
}> = ({ sentenceArray, sentenceArrayIndex }) => {
  const { sentenceTexts } = useContext(ComplexSentencePaneContext);
  return (
    <div style={{ display: 'flex' }}>
      <div>
        {!!sentenceTexts[sentenceArray[0]] && (
          <div
            style={{
              border: '1px dashed #739433',
              padding: 4,
              borderRadius: 4,
            }}
          >
            <SentenceArrayPane
              sentenceArray={sentenceArray}
              sentenceArrayIndex={sentenceArrayIndex}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default SubSentenceArrayPane;
