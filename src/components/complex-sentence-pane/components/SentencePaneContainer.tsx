import React, { useContext } from 'react';
import { SentencePane } from '../../sentence-pane';

import { ComplexSentencePaneContext } from '../complex-sentence-pane';

const SentencePaneContainer: React.FC<{
  sentenceId: string;
  sentenceArrayIndex: number;
}> = ({ sentenceId, sentenceArrayIndex }) => {
  const {
    units,
    Cursor,
    sentences,
    sentenceTexts,
    branchUnitIds,
    parentUnitIds,
    sentenceArrays,
    sentenceBodyTexts,
    sentencePaneSentences,
    sentenceCommentUnitIds,
    setSentenceTexts,
    setSentenceBodyTexts,
  } = useContext(ComplexSentencePaneContext);
  const {
    color,
    bodyTexts,
    shuuJoshi,
    topicUnitId,
    topicBranch,
    juntaiJoshi,
    isTaigendome,
    buntouSeibuns,
    commentUnitIds,
    juntaiJoshiBunmatsu,
  } = sentences[sentenceId];
  return (
    <SentencePane
      Cursor={Cursor}
      units={units}
      color={color}
      bodyTexts={bodyTexts}
      shuuJoshi={shuuJoshi}
      sentences={sentencePaneSentences}
      sentenceId={sentenceId}
      topicUnitId={topicUnitId}
      topicBranch={topicBranch}
      juntaiJoshi={juntaiJoshi}
      isTaigendome={isTaigendome}
      branchUnitIds={branchUnitIds}
      parentUnitIds={parentUnitIds}
      buntouSeibuns={buntouSeibuns}
      sentenceArray={sentenceArrays[sentenceArrayIndex]}
      commentUnitIds={commentUnitIds}
      isMainSentence={sentenceId === sentenceArrays[0].slice(-1)[0]}
      sentenceArrayIndex={sentenceArrayIndex}
      superSentenceTexts={sentenceTexts}
      isMainSentenceArray={sentenceArrays[0].includes(sentenceId)}
      juntaiJoshiBunmatsu={juntaiJoshiBunmatsu}
      superSentenceBodyTexts={sentenceBodyTexts}
      sentenceCommentUnitIds={sentenceCommentUnitIds}
      superSetSentenceTexts={setSentenceTexts}
      superSetSentenceBodyTexts={setSentenceBodyTexts}
    />
  );
};

export default SentencePaneContainer;
