import { WordPane } from '@chihatw/sentence-form.word-pane';
import React, { useContext } from 'react';

import BranchPane from './BranchPane';
import BranchesPane from './BranchesPane';
import { SentencePaneContext } from '../sentence-pane';

const MeishiBunmatsuUnitPane: React.FC<{ unitId: string }> = ({ unitId }) => {
  const { units, cursor, branchUnitIds } = useContext(SentencePaneContext);
  const unit = units[unitId];
  const branches = branchUnitIds[unitId]
    ? branchUnitIds[unitId].map(
        (unitId) =>
          unit.branches.filter((branch) => branch.unitId === unitId)[0]
      )
    : [];

  // ブランチの最終項とそれ以外に分ける
  const lastBranch = branches.pop();
  return (
    <div style={{ display: 'flex', alignItems: 'flex-end' }}>
      {/* 名詞文末のブランチの最後以外は前に出す 　「これが」私のです */}
      {!!branches.length && (
        <>
          <BranchesPane unitId={unit.id} branches={branches} />
          <div style={{ width: 2 }} />
        </>
      )}
      {/* 名詞文末のブランチの最後の一つは直前に置く 　これが「私の」です */}
      {!!lastBranch && (
        <>
          <BranchPane
            unitId={lastBranch.unitId}
            joshiLabels={lastBranch.joshiLabels}
            isCommentMeishi={lastBranch.isCommentMeishi}
          />
          <div style={{ width: 1 }} />
        </>
      )}
      {(!!unit.text || !unit.isTaigendome) && (
        <WordPane text={unit.text} hinshi={unit.hinshi} cursor={cursor} />
      )}
    </div>
  );
};

export default MeishiBunmatsuUnitPane;
