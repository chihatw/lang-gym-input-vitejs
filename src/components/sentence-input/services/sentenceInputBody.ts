import { useContext, useEffect, useState } from 'react';

import { juntaiJoshiTexts } from '../entities/Sentence';
import { SentenceInputContext } from '../sentence-input';

export const useSentenceInputBody = () => {
  const { sentenceID, globalSentences, hasJuntaiJoshiBunmatsu } =
    useContext(SentenceInputContext);
  const [hasMarginTop, setHasMarginTop] = useState(false);
  const [hasMultipleComments, setHasMultipleComments] = useState(false);
  const [juntaiJoshiLabel, setJuntaiJoshiLabel] = useState('');

  useEffect(() => {
    const sentence = globalSentences[sentenceID];
    if (!sentence) return;

    const juntaiJoshiLabel = sentence.juntaiJoshi
      ? juntaiJoshiTexts[sentence.juntaiJoshi]
      : '';
    setJuntaiJoshiLabel(juntaiJoshiLabel);
  }, [globalSentences, sentenceID]);

  useEffect(() => {
    const sentence = globalSentences[sentenceID];
    if (!sentence) return;

    const hasMarginTop =
      !!sentence.buntouSeibuns.length ||
      !!sentence.topic ||
      !!sentence.comments.length;

    setHasMarginTop(hasMarginTop);
    setHasMultipleComments(sentence.comments.length > 1);
  }, [sentenceID, globalSentences]);
  return {
    hasMarginTop,
    juntaiJoshiLabel,
    hasMultipleComments,
    hasJuntaiJoshiBunmatsu,
  };
};
