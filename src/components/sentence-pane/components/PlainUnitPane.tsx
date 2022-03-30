import { WordPane } from '@chihatw/sentence-form.word-pane';
import React, { useContext } from 'react';

import BranchesPane from './BranchesPane';
import { SentencePaneContext } from '../sentence-pane';

const PlainUnitPane: React.FC<{
  unitId: string;
}> = ({ unitId }) => {
  const {
    units,
    cursor,
    sentenceId,
    branchUnitIds,
    handleVisible,
    sentenceCommentUnitIds,
  } = useContext(SentencePaneContext);
  const commentUnitIds = sentenceCommentUnitIds[sentenceId];
  // 最終以外のコメントでクリック可能
  const clickableUnitIds = commentUnitIds.filter(
    (_, index) => index !== commentUnitIds.length - 1
  );
  const unit = units[unitId];
  return (
    <div style={{ display: 'flex' }}>
      {!!unit.branches.length && (
        <BranchesPane
          unitId={unitId}
          branches={
            !!branchUnitIds[unitId]
              ? branchUnitIds[unitId].map(
                  (unitId) =>
                    unit.branches.filter(
                      (branch) => branch.unitId === unitId
                    )[0]
                )
              : []
          }
        />
      )}
      {!!unit.branches.length && <div style={{ width: 1 }} />}
      <div style={{ display: 'flex', alignItems: 'flex-end' }}>
        <WordPane
          text={unit.text}
          hinshi={unit.hinshi}
          cursor={cursor}
          handleClick={
            clickableUnitIds.includes(unitId)
              ? () => handleVisible(unitId)
              : undefined
          }
        />
      </div>
    </div>
  );
};

export default PlainUnitPane;
