import React, { useContext } from 'react';

import TopicInput from './TopicInput';
import { Sentence } from '../entities/Sentence';
import CommentsInput from './CommentsInput';
import ShuuJoshiInput from './ShuuJoshiInput';
import JuntaiJoshiPane from './JuntaiJoshiPane';
import BuntouSeibunsInput from './BuntouSeibunsInput';
import { SentenceInputContext } from '../sentence-input';
import JuntaiJoshiBunmatsuInput from './JuntaiJoshiBunmatsuInput';
import { useSentenceInputBody } from '../services/sentenceInputBody';

const SentenceInputBody: React.FC = () => {
  const {
    hasMarginTop,
    hasMultipleComments,
    hasJuntaiJoshiBunmatsu,
    juntaiJoshiLabel,
  } = useSentenceInputBody();
  const { sentenceID, globalSentences } = useContext(SentenceInputContext);
  const sentence: Sentence | null = globalSentences[sentenceID];
  if (!!sentence) {
    return (
      <>
        {hasMarginTop && <div style={{ height: 12 }} />}
        <div style={{ display: 'flex' }}>
          <div style={{ display: 'flex', alignItems: 'flex-start' }}>
            {!!sentence.buntouSeibuns && <BuntouSeibunsInput />}
            <TopicInput />
            <CommentsInput />
          </div>

          <div
            style={{
              display: 'flex',
              alignItems: hasMultipleComments ? 'flex-end' : 'flex-start',
            }}
          >
            {sentence.juntaiJoshi && (
              <JuntaiJoshiPane label={juntaiJoshiLabel} />
            )}
            {hasJuntaiJoshiBunmatsu && <JuntaiJoshiBunmatsuInput />}
            <ShuuJoshiInput />
          </div>
        </div>
      </>
    );
  } else {
    return <div />;
  }
};

export default SentenceInputBody;
