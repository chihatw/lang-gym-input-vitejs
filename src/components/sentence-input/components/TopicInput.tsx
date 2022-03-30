import React, { useContext } from 'react';

import { Sentence } from '../entities/Sentence';
import RenyouBranchesInput from './BranchesInput/RenyouBranchesInput';
import { SentenceInputContext } from '../sentence-input';

const TopicInput: React.FC = () => {
  const { sentenceID, globalSentences } = useContext(SentenceInputContext);

  const sentence: Sentence | null = globalSentences[sentenceID];

  if (!!sentence && !!sentence.topic) {
    return (
      <div style={{ display: 'flex' }}>
        <RenyouBranchesInput unitID={sentence.topic} isTopicBranch={true} />
        <div style={{ width: 20 }} />
      </div>
    );
  } else {
    return <div />;
  }
};

export default TopicInput;
