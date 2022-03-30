import { useContext, useEffect, useState } from 'react';

import { Unit } from '../entities/Unit';
import { Word } from '../entities/Word';
import { SentenceInputContext } from '../sentence-input';

export const useRentaiBranchesInput = (unitID: string) => {
  const { globalUnits, globalWords } = useContext(SentenceInputContext);

  const [disabledAddBranch, setDisabledAddBranch] = useState(true);

  useEffect(() => {
    const unit: Unit | null = globalUnits[unitID];
    if (!unit) return;
    const word: Word | null = globalWords[unit.wordID];
    !!word && setDisabledAddBranch(!word.text);
  }, [globalUnits, unitID, globalWords]);

  return {
    disabledAddBranch,
  };
};
