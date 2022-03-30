import { useContext, useEffect, useState } from 'react';

import { Sentence } from '../entities/Sentence';
import { isMeishiKu, Unit } from '../entities/Unit';
import { SentenceInputContext } from '../sentence-input';

export const useUnitInput = (unitID: string) => {
  const {
    globalUnits,
    globalWords,
    sentenceID,
    globalSentences,
    onChangeSentence,
  } = useContext(SentenceInputContext);
  const [hasMeishiKu, setHasMeishiKu] = useState(false);
  const sentence: Sentence | null = globalSentences[sentenceID];
  const [setsuzokuJoshi, setSetsuzokuJoshi] = useState<string>(
    !!sentence ? sentence.setsuzokuJoshis[unitID] || 'none' : 'none'
  );
  const isCommentUnit = !!sentence && sentence.comments.includes(unitID);

  useEffect(() => {
    const unit: Unit | null = globalUnits[unitID];
    if (!unit) return;
    const word = globalWords[unit.wordID];
    if (!word) return;
    setHasMeishiKu(isMeishiKu(word.hinshi));
  }, [globalUnits, unitID, globalWords]);

  const onChangeSetsuzokuJoshi = (setsuzokuJoshi: string) => {
    setSetsuzokuJoshi(setsuzokuJoshi);
    const newSetsuzokuJoshis = { ...sentence.setsuzokuJoshis };
    if (setsuzokuJoshi === 'none') {
      delete newSetsuzokuJoshis[unitID];
    } else {
      newSetsuzokuJoshis[unitID] = setsuzokuJoshi;
    }
    const newSentence = { ...sentence };
    newSentence.setsuzokuJoshis = newSetsuzokuJoshis;
    onChangeSentence({ newSentence });
  };

  return {
    hasMeishiKu,
    isCommentUnit,
    setsuzokuJoshi,
    onChangeSetsuzokuJoshi,
  };
};
