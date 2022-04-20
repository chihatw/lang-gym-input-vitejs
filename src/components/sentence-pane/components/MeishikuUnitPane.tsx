import { WordPane } from '@chihatw/sentence-form.word-pane';
import { IconButton } from '@mui/material';
import React, { useContext } from 'react';
import ChevronRightRounded from '@mui/icons-material/ChevronRightRounded';

import BranchesPane from './BranchesPane';
import FoldedWordPane from './FoldedWordPane';
import { SentencePaneContext } from '../sentence-pane';

const MeishikuUnitPane: React.FC<{
  unitId: string;
}> = ({ unitId }) => {
  const { units, cursor, collapsedUnitIds, branchUnitIds } =
    useContext(SentencePaneContext);
  const unit = units[unitId];

  return (
    <MeishikuDashedBorder open={!collapsedUnitIds.includes(unitId)}>
      <div
        style={{
          display: 'flex',
          flexWrap: 'nowrap',
          position: 'relative',
          alignItems: 'flex-end',
        }}
      >
        {!collapsedUnitIds.includes(unitId) ? (
          <>
            <ExpandButton unitId={unitId} />
            <div style={{ marginRight: 3 }}>
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
            </div>
            <WordPane text={unit.text} hinshi={unit.hinshi} cursor={cursor} />
          </>
        ) : (
          <FoldedWordPane unitId={unitId} />
        )}
      </div>
    </MeishikuDashedBorder>
  );
};

export default MeishikuUnitPane;

const MeishikuDashedBorder: React.FC<{
  open: boolean;
  children: React.ReactNode;
}> = ({ children, open }) => {
  if (open) {
    return (
      <div
        style={{
          border: '1px dashed red',
          padding: 4,
          borderRadius: 4,
        }}
      >
        {children}
      </div>
    );
  } else {
    return <div>{children}</div>;
  }
};

const ExpandButton: React.FC<{
  unitId: string;
}> = ({ unitId }) => {
  const { handleCollapse } = useContext(SentencePaneContext);
  return (
    <div
      style={{
        height: 32,
        marginLeft: -8,
        marginRight: -4,
      }}
    >
      <IconButton
        size='small'
        style={{ color: '#FF4E62' }}
        onClick={() => handleCollapse(unitId)}
        onMouseDown={(e) => e.stopPropagation()}
      >
        <ChevronRightRounded />
      </IconButton>
    </div>
  );
};
