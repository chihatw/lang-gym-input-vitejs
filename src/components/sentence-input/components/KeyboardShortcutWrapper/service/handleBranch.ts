import { useContext } from 'react';

import { getActiveUnit } from './getActiveUnit';
import { getActiveBranchID } from './getActiveBranchID';
import { SentenceInputContext } from '../../../sentence-input';

export const useHandleBranch = () => {
  const {
    globalUnits,
    globalBranches,
    onRemoveBranch,
    onAddDoushiBranch,
    onAddMeishiRenyouBranch,
    onAddMeishiRentaiBranch,
  } = useContext(SentenceInputContext);
  const addBranchWithKakuJoshi = (kakuJoshi: string) => {
    const unit = getActiveUnit(globalUnits);
    if (!unit) return;
    onAddMeishiRenyouBranch({
      unitID: unit.id,
      kakuJoshi,
      kakariJoshi: '',
    });
  };
  const addBranchWithKakariJoshi = (kakariJoshi: string) => {
    const unit = getActiveUnit(globalUnits);
    if (!unit) return;
    onAddMeishiRenyouBranch({
      unitID: unit.id,
      kakuJoshi: '',
      kakariJoshi,
    });
  };
  const addBranchWithRentaiJoshi = () => {
    const unit = getActiveUnit(globalUnits);
    if (!unit) return;
    onAddMeishiRentaiBranch(unit.id);
  };
  const addDoushiBranch = () => {
    const unit = getActiveUnit(globalUnits);
    if (!unit) return;
    onAddDoushiBranch(unit.id);
  };
  const removeBranch = () => {
    const unit = getActiveUnit(globalUnits);
    if (!unit) return;
    const branchID = getActiveBranchID(unit.id, globalBranches);
    if (!branchID) return;
    onRemoveBranch(branchID);
  };
  return [
    {
      key: 'shift+ctrl+g',
      action: () => addBranchWithKakuJoshi('ga'),
    },
    {
      key: 'shift+ctrl+i',
      action: () => addBranchWithKakuJoshi('ni'),
    },
    {
      key: 'shift+ctrl+w',
      action: () => addBranchWithKakuJoshi('wo'),
    },
    {
      key: 'shift+ctrl+d',
      action: () => addBranchWithKakuJoshi('de'),
    },
    {
      key: 'shift+ctrl+t',
      action: () => addBranchWithKakuJoshi('to'),
    },
    {
      key: 'shift+ctrl+e',
      action: () => addBranchWithKakuJoshi('he'),
    },
    {
      key: 'shift+ctrl+k',
      action: () => addBranchWithKakuJoshi('kara'),
    },
    {
      key: 'shift+ctrl+y',
      action: () => addBranchWithKakuJoshi('yori'),
    },
    {
      key: 'shift+ctrl+h',
      action: () => addBranchWithKakariJoshi('ha'),
    },
    {
      key: 'shift+ctrl+m',
      action: () => addBranchWithKakariJoshi('mo'),
    },
    {
      key: 'shift+ctrl+n',
      action: addBranchWithRentaiJoshi,
    },
    {
      key: 'shift+ctrl+v',
      action: addDoushiBranch,
    },
    {
      key: 'shift+ctrl+r',
      action: removeBranch,
    },
    {
      key: 'shift+ctrl+p',
      action: removeBranch,
    },
    {
      key: 'shift+command+r',
      action: () => {
        alert('ブランチ削除はshift+ctrl+r/p');
      },
    },
  ];
};
