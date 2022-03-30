import { useContext, useEffect, useState } from 'react';

import { Sentence } from '../entities/Sentence';
import { SentenceInputContext } from '../sentence-input';

export const useShuuJoshiInput = () => {
  const { sentenceID, globalSentences, onChangeSentence } =
    useContext(SentenceInputContext);

  const [value, setValue] = useState('');

  useEffect(() => {
    let joshi = '';
    const sentence: Sentence | null = globalSentences[sentenceID];
    if (!!sentence) {
      joshi = sentence.shuuJoshi || '';
    }
    setValue(joshi);
  }, [globalSentences, sentenceID]);

  const onChangeValue = (value: string) => {
    const sentence: Sentence | null = globalSentences[sentenceID];
    if (!sentence) return;
    setValue(value);
    const newSentence = { ...sentence };

    newSentence.shuuJoshi = value;
    onChangeSentence({ newSentence });
  };

  return { value, onChangeValue };
};
