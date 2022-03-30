import { useContext, useEffect, useState } from 'react';

import { Word } from '../entities/Word';
import { Sentence } from '../entities/Sentence';
import { isMeishiKu, Unit } from '../entities/Unit';
import { SentenceInputContext } from '../sentence-input';

export const useRenyouBranchesInput = (unitID: string) => {
  const { sentenceID, globalSentences, globalUnits, globalWords } =
    useContext(SentenceInputContext);
  const unit: Unit | null = globalUnits[unitID];
  const unitWord: Word | null =
    !!unit && unit.wordID ? globalWords[unit.wordID] : null;
  const isTopic = !unitWord;

  const isMeishiKuUnit = !!unitWord ? isMeishiKu(unitWord.hinshi) : false;
  const sentence: Sentence | null = globalSentences[sentenceID];
  const isCommentUnit = !!sentence && sentence.comments.includes(unitID);

  const [disabledAddBranch, setDisabledAddBranch] = useState(true);

  useEffect(() => {
    const unit: Unit | null = globalUnits[unitID];
    if (!unit) return;
    const word = globalWords[unit.wordID];
    if (isMeishiKuUnit) {
      isCommentUnit && !!word && setDisabledAddBranch(!word.text);
    } else {
      !!word && setDisabledAddBranch(!word.text && word.hinshi !== 'doushi');
    }
  }, [
    unitID,
    isTopic,
    globalUnits,
    globalWords,
    isCommentUnit,
    isMeishiKuUnit,
  ]);

  return {
    disabledAddBranch,
  };
};
