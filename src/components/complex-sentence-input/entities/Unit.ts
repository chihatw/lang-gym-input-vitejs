import { Branch, getJoshiText } from './Branch';
import { Sentence } from './Sentence';
import { Word } from './Word';

export type Unit = {
  id: string;
  wordID: string;
  branchIDs: string[];
};

export const INITIAL_UNIT: Unit = {
  id: '',
  wordID: '',
  branchIDs: [],
};

export const isTopicBranchUnit = (
  sentence: Sentence,
  units: { [id: string]: Unit },
  branches: { [id: string]: Branch },
  unitID: string
) => {
  const topicUnit = !!sentence.topic ? units[sentence.topic] : null;
  const topicBranch = !!topicUnit ? branches[topicUnit.branchIDs[0]] : null;
  return !!topicBranch ? topicBranch.unitID === unitID : false;
};

export const isCommentRenyouBranchUnit = (
  sentence: Sentence,
  units: { [id: string]: Unit },
  branches: { [id: string]: Branch },
  unitID: string
) => {
  const commentUnits = sentence.comments.map((unitID) => units[unitID]);
  const commentUnitRenyouBranches: Branch[] = [];
  commentUnits.forEach((unit) => {
    unit.branchIDs.forEach((branchID) => {
      commentUnitRenyouBranches.push(branches[branchID]);
    });
  });
  const commentUnitRenyouBranchUnitIDs = commentUnitRenyouBranches.map(
    (branch) => branch.unitID
  );
  return commentUnitRenyouBranchUnitIDs.includes(unitID);
};

export const getUnitHinshi = (
  unit: Unit,
  words: { [id: string]: Word }
): string => {
  const word = words[unit.wordID];
  return word.hinshi;
};

export const getSortedUnitIDs = ({
  units,
  unitID,
  branches,
}: {
  units: { [id: string]: Unit };
  unitID: string;
  branches: { [id: string]: Branch };
}): string[] => {
  const subUnit = units[unitID];
  if (!!subUnit) {
    const sortedUnitIDs: string[] = [];
    checkUnit({
      unit: subUnit,
      units,
      branches,
      sortedUnitIDs,
      originalUnitID: subUnit.id,
    });
    return sortedUnitIDs;
  } else {
    return [];
  }
};

export const getUnitText = ({
  words,
  units,
  unitID,
  branches,
}: {
  units: { [id: string]: Unit };
  words: { [id: string]: Word };
  unitID: string;
  branches: { [id: string]: Branch };
}): string => {
  const unit = units[unitID];
  const parentBranch: Branch | null = Object.values(branches).filter(
    (branch) => branch.unitID === unit.id
  )[0];
  const parentBranchJoshi = parentBranch ? getJoshiText(parentBranch) : '';
  const word: Word | null = words[unit.wordID];
  return (!!word ? word.text : '') + parentBranchJoshi;
};

const checkUnit = ({
  unit,
  units,
  branches,
  sortedUnitIDs,
  originalUnitID,
}: {
  unit: Unit;
  units: { [id: string]: Unit };
  branches: { [id: string]: Branch };
  sortedUnitIDs: string[];
  originalUnitID: string;
}) => {
  // unit.idがチェック済みなら処理終了
  if (sortedUnitIDs.includes(unit.id)) return;

  const subUnits: Unit[] = unit.branchIDs.map(
    (branchID) => units[branches[branchID].unitID]
  );
  // unitのsubUnitsがチェック済みか確認
  const uncheckedUnits: Unit[] = Object.values(subUnits).filter(
    (unit) => !sortedUnitIDs.includes(unit.id)
  );
  if (uncheckedUnits.length) {
    // 未チェックがあれば、チェックする
    uncheckedUnits.forEach((unit) => {
      checkUnit({
        unit,
        units,
        branches,
        sortedUnitIDs,
        originalUnitID,
      });
    });
  } else {
    // 未チェックがなければ、unit.idをチェック済みに含める
    sortedUnitIDs.push(unit.id);
    // ブランチがoriginalUnitでなければ、親ブランチのチェック
    if (unit.id === originalUnitID) return;
    const parentBranch: Branch | null = Object.values(branches).filter(
      (branch) => branch.unitID === unit.id
    )[0];
    // 親ユニットがあれば、親ユニットをチェックする
    if (parentBranch) {
      const parentUnit: Unit = Object.values(units).filter((parentUnit) =>
        parentUnit.branchIDs.includes(parentBranch.id)
      )[0];
      checkUnit({
        unit: parentUnit,
        units,
        branches,
        sortedUnitIDs,
        originalUnitID,
      });
    }
  }
};
