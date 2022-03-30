import { useContext, useEffect, useState } from 'react';

import { Sentence } from '../entities/Sentence';
import { SentenceInputContext } from '../sentence-input';

export const useJuntaiJoshiBunmatsuInput = () => {
  const {
    sentenceID,
    globalSentences,
    onChangeSentence,
    onRemoveJuntaiJoshiBunmatsu,
  } = useContext(SentenceInputContext);

  const [text, setText] = useState('');
  useEffect(() => {
    let text = '';
    const sentence: Sentence | null = globalSentences[sentenceID];
    if (!!sentence) {
      text = sentence.juntaiJoshiBunmatsu;
    }
    setText(text);
  }, [globalSentences, sentenceID]);

  // テキストフィールドの幅を文字に合わせる
  useEffect(() => {
    const sentence: Sentence | null = globalSentences[sentenceID];
    if (!sentence) return;
    const span = document.getElementById(
      `juntaiJoshiBunmatsuMetrics_${sentence.id}`
    );
    const input = document.getElementById(`juntaiJoshiBunmatsu_${sentence.id}`);
    if (span && input) {
      span.textContent = text;
      input.style.width = `${Math.max(span.clientWidth + 8, 20)}px`;
    }
  }, [text, sentenceID, globalSentences]);

  const onChangeText = (text: string) => {
    const sentence: Sentence | null = globalSentences[sentenceID];
    if (!sentence) return;
    setText(text);
    const newSentence = { ...sentence };
    newSentence.juntaiJoshiBunmatsu = text;
    onChangeSentence({ newSentence });
  };

  return {
    text,
    sentenceID,
    onChangeText,
    globalSentences,
    onRemoveJuntaiJoshiBunmatsu,
  };
};
