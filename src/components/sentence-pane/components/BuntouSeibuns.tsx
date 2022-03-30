import { WordPane } from '@chihatw/sentence-form.word-pane';
import React, { useContext } from 'react';
import { SentencePaneContext } from '../sentence-pane';

const BuntouSeibuns: React.FC<{
  words: {
    text: string;
    hinshi: string;
  }[];
}> = ({ words }) => {
  const { cursor } = useContext(SentencePaneContext);
  return (
    <div style={{ display: 'flex', marginRight: 4, flexWrap: 'nowrap' }}>
      {words.map((word, index) => (
        <div key={index}>
          <div style={{ display: 'flex', flexWrap: 'nowrap' }}>
            <WordPane
              text={word.text}
              hinshi={word.hinshi}
              cursor={cursor}
              isBuntou={true}
            />
            {!!words[index + 1] && <div style={{ width: 4 }} />}
          </div>
        </div>
      ))}
    </div>
  );
};

export default BuntouSeibuns;
