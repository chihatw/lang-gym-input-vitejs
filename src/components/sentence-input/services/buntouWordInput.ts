import { useContext, useEffect, useState } from 'react';

import { Word } from '../entities/Word';
import { Sentence } from '../entities/Sentence';
import { SentenceInputContext } from '../sentence-input';

export const useBuntouWordInput = (wordID: string) => {
  const {
    sentenceID,
    globalWords,
    globalSentences,
    isFirstSentence,
    onChangeSentence,
    onSetActiveSentence,
  } = useContext(SentenceInputContext);
  const word: Word | null = globalWords[wordID];
  const [text, setText] = useState(word.text);
  const [hinshi, setHinshi] = useState(word.hinshi);
  const [hinshis, setHinshis] = useState<string[]>([
    'setsuzokushi',
    'hukushi',
    'other',
  ]);

  useEffect(() => {
    const sentence: Sentence | null = globalSentences[sentenceID];
    if (!sentence) return;
    let isBuntou = sentence.buntouSeibuns[0] === wordID;
    // 複文の一行目以外は「文頭」ではない
    if (!isFirstSentence) {
      isBuntou = false;
    }
    const hinshis: string[] = isBuntou
      ? ['setsuzokushi', 'hukushi', 'other']
      : ['hukushi', 'other'];
    setHinshis(hinshis);
  }, [sentenceID, wordID, isFirstSentence, globalSentences]);

  const onChangeText = (text: string) => {
    setText(text);
    const newWords = { ...globalWords };
    const newWord = { ...word, text };
    newWords[wordID] = newWord;
    onChangeSentence({ newWords });
  };
  const onChangeHinshi = (hinshi: string) => {
    setHinshi(hinshi);
    const newWords = { ...globalWords };
    const newWord = { ...word, hinshi };
    newWords[wordID] = newWord;
    onChangeSentence({ newWords });
  };
  const onFocus = () => {
    onSetActiveSentence();
  };
  return {
    text,
    hinshi,
    hinshis,
    onFocus,
    onChangeText,
    onChangeHinshi,
  };
};
