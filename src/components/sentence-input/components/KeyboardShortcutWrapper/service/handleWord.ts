import { useContext } from 'react';

import { Unit } from '../../../entities/Unit';
import { Branch } from '../../../entities/Branch';
import { getActiveUnit } from './getActiveUnit';
import { getActiveWordID } from './getActiveWordID';
import { SentenceInputContext } from '../../../sentence-input';

export const useHandleWord = () => {
  const {
    sentenceID,
    globalUnits,
    onChangeHinshi,
    globalBranches,
    globalSentences,
  } = useContext(SentenceInputContext);
  const changeHinshi = (hinshi: string) => {
    const unit = getActiveUnit(globalUnits);
    if (!unit) return;
    const wordID = getActiveWordID();
    if (!wordID) return;

    const sentence = globalSentences[sentenceID];
    if (!sentence) return;
    if (sentence.comments.includes(unit.id) && hinshi === 'meishi') {
      onChangeHinshi(unit.id, wordID, 'meishibunmatsu');
    } else {
      onChangeHinshi(unit.id, wordID, hinshi);
    }
  };
  const focusNextWord = () => {
    try {
      const unit = getActiveUnit(globalUnits);
      const wordID = getActiveWordID();
      if (!unit) return;

      const parentUnit = Object.values(
        globalUnits as { [key: string]: Unit }
      ).filter((globalUnit) =>
        globalUnit.branchIDs
          .map((branchID) =>
            !!globalBranches[branchID] ? globalBranches[branchID].unitID : ''
          )
          .includes(unit.id)
      )[0];

      if (!parentUnit) return;
      const branchID = parentUnit.branchIDs.filter((branchID) => {
        const globalBranch: Branch | null = globalBranches[branchID];
        if (!!globalBranch) {
          const globalUnit = globalUnits[globalBranch.unitID];
          if (!!globalUnit) {
            return globalUnit.wordID === wordID;
          }
        }
        return false;
      })[0];
      const branchIDs = parentUnit.branchIDs;
      const index = branchIDs.indexOf(branchID);
      const nextBranchID = branchIDs[index + 1];
      if (branchIDs.length > 1 && !!nextBranchID) {
        const focusedBranch: Branch | null = globalBranches[nextBranchID];
        if (!!focusedBranch) {
          const focusedUnit: Unit | null = globalUnits[focusedBranch.unitID];
          !!focusedUnit && focusTextField(`txt_${focusedUnit.wordID}`);
        }
      } else {
        focusTextField(`txt_${parentUnit.wordID}`);
      }
    } catch (e) {
      console.warn(e);
    }
  };

  const focusPreWord = (isFocusPrevSibling?: boolean) => {
    const unit = getActiveUnit(globalUnits);
    if (!unit) return;
    const wordID = getActiveWordID();
    if (!wordID) return;

    if (!isFocusPrevSibling && unit.branchIDs.length) {
      let subUnit: Unit | null = null;
      // 連体ブランチがあれば、連体ブランチの末子にフォーカス
      if (unit.branchIDs.length) {
        const lastBranch: Branch | null =
          globalBranches[unit.branchIDs.slice(-1)[0]];
        if (!!lastBranch) {
          subUnit = globalUnits[lastBranch.unitID];
        }
      }
      if (!!subUnit) {
        focusTextField(`txt_${subUnit.wordID}`);
        return;
      }
    }

    const parentUnit = Object.values(
      globalUnits as { [key: string]: Unit }
    ).filter((globalUnit) => {
      return globalUnit.branchIDs
        .map((branchID) => {
          const globalBranch: Branch | null = globalBranches[branchID];
          return !!globalBranch ? globalBranch.unitID : '';
        })
        .includes(unit.id);
    })[0];

    if (!parentUnit) return;
    const branchID = parentUnit.branchIDs.filter((branchID) => {
      const globalBranch: Branch | null = globalBranches[branchID];
      if (!!globalBranch) {
        const globalUnit = globalUnits[globalBranch.unitID];
        return !!globalUnit && globalUnit.wordID === wordID;
      }
      return false;
    })[0];
    if (!parentUnit) return;
    const branchIDs = parentUnit.branchIDs;
    const index = branchIDs.indexOf(branchID);
    const preBranchID = branchIDs[index - 1];
    if (branchIDs.length > 1 && preBranchID) {
      const focusedBranch: Branch | null = globalBranches[preBranchID];
      if (!!focusedBranch) {
        const focusedUnit: Unit | null = globalUnits[focusedBranch.unitID];
        if (!!focusedUnit) {
          focusTextField(`txt_${focusedUnit.wordID}`);
        }
      }
    }
  };

  return [
    { key: 'tab', action: focusNextWord },
    { key: 'shift+tab', action: focusPreWord },
    { key: 'up', action: () => focusPreWord(true) },
    {
      key: 'shift+ctrl+command+m',
      action: () => changeHinshi('meishi'),
    },
    {
      key: 'shift+ctrl+command+j',
      action: () => changeHinshi('jisuushi'),
    },
    {
      key: 'shift+ctrl+command+d',
      action: () => changeHinshi('doushi'),
    },
    {
      key: 'shift+ctrl+command+i',
      action: () => changeHinshi('ikeiyoushi'),
    },
    {
      key: 'shift+ctrl+command+n',
      action: () => changeHinshi('nakeiyoushi'),
    },
    {
      key: 'shift+ctrl+command+h',
      action: () => changeHinshi('hukushi'),
    },
    {
      key: 'shift+ctrl+command+r',
      action: () => changeHinshi('rentaishi'),
    },
    {
      key: 'shift+ctrl+command+s',
      action: () => changeHinshi('sentence'),
    },
  ];
};

const focusTextField = (id: string) => {
  const textField = document.getElementById(id);
  !!textField && (textField as HTMLInputElement).focus();
};
