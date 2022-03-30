import { useContext } from 'react';

import { SentenceInputContext } from '../sentence-input';
import { Branch, RentaiJoshi, RenyouJoshi } from '../entities/Branch';

export const useBranchInput = (branchID: string) => {
  const { globalBranches } = useContext(SentenceInputContext);
  const branch: Branch | null = globalBranches[branchID];
  const hasKakuJoshi = !!branch
    ? typeof (branch.joshi as RenyouJoshi).kakuJoshi !== 'undefined'
    : false;
  const hasKakariJoshi = !!branch
    ? typeof (branch.joshi as RenyouJoshi).kakariJoshi !== 'undefined'
    : false;
  const hasRentaiJoshi = !!branch
    ? typeof (branch.joshi as RentaiJoshi).hasRentaiJoshi !== 'undefined'
    : false;
  const rentaiJoshiText =
    !!branch && (branch.joshi as RentaiJoshi).hasRentaiJoshi ? 'の' : '';

  return {
    hasKakuJoshi,
    hasKakariJoshi,
    hasRentaiJoshi,
    rentaiJoshiText,
  };
};
