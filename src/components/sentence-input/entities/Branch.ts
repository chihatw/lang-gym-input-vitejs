import kakuJoshiTexts from 'kakujoshi-texts';
import kakariJoshiTexts from 'kakarijoshi-texts';

import { Unit } from './Unit';
import { Word } from './Word';

export type RentaiJoshi = {
  hasRentaiJoshi: boolean;
};

export type RenyouJoshi = {
  kakuJoshi: string;
  kakariJoshi: string;
};

export type Branch = {
  id: string;
  lock?: boolean;
  joshi: RentaiJoshi | RenyouJoshi;
  unitID: string;
};

export const getJoshiText = (branch: Branch) => {
  const kakuJoshi = (branch.joshi as RenyouJoshi).kakuJoshi;
  const kakariJoshi = (branch.joshi as RenyouJoshi).kakariJoshi!;
  const hasRentaiJoshi = (branch.joshi as RentaiJoshi).hasRentaiJoshi;
  const kakuJoshiText = !!kakuJoshi ? kakuJoshiTexts[kakuJoshi] : '';
  const kakariJoshiText = !!kakariJoshi ? kakariJoshiTexts[kakariJoshi] : '';
  const rentaiJoshiText = !!hasRentaiJoshi ? 'の' : '';
  return kakuJoshiText + kakariJoshiText + rentaiJoshiText;
};

export const hasMeishiGrandParentUnit = ({
  words,
  units,
  branchID,
  branches,
}: {
  branchID: string;
  units: { [id: string]: Unit };
  branches: { [id: string]: Branch };
  words: { [id: string]: Word };
}) => {
  let result = false;
  const unit = Object.values(units).filter((unit) =>
    unit.branchIDs.includes(branchID)
  )[0];
  const parentBranch: Branch | null = Object.values(branches).filter(
    (branch) => branch.unitID === unit.id
  )[0];
  const parentUnit: Unit | null = parentBranch
    ? Object.values(units).filter((unit) =>
        unit.branchIDs.includes(parentBranch.id)
      )[0]
    : null;
  if (!!parentUnit) {
    const parentUnitRootWord = words[parentUnit.wordID];
    if (!!parentUnitRootWord) {
      result = parentUnitRootWord.hinshi === 'meishi';
    } else {
      console.log('no parent unit root word');
    }
  }
  return result;
};

export const isRentaiBranch = (branch: Branch) => {
  return typeof (branch.joshi as RentaiJoshi).hasRentaiJoshi !== 'undefined';
};
