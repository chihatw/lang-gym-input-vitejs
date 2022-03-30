import { WordPane } from '@chihatw/sentence-form.word-pane';
import { IconButton } from '@mui/material';
import getSortedUnitIds from 'get-sorted-unit-id';
import React, { useContext } from 'react';
import hinshiColors from 'hinshi-colors';

import { SentencePaneContext } from '../sentence-pane';
import ChevronLeftRounded from '@mui/icons-material/ChevronLeftRounded';

const FoldedWordPane: React.FC<{ unitId: string }> = ({ unitId }) => {
  const {
    units,
    cursor,
    branchUnitIds,
    parentUnitIds,
    handleCollapse,
    invisibleUnitIds,
  } = useContext(SentencePaneContext);
  const unit = units[unitId];
  const sortedUnits = getSortedUnitIds({
    unitId,
    parentUnitIds,
    branchUnitIds,
    invisibleUnitIds,
  }).map((unitId) => units[unitId]);

  const rootUnit = sortedUnits.pop();

  const foldedWordText =
    sortedUnits.map((unit) => unit.text + unit.parentBranchJoshi).join('') +
    rootUnit?.text;
  return (
    <div
      style={{
        border: '1px dashed red',
        display: 'flex',
        flexWrap: 'nowrap',
      }}
    >
      <div
        style={{
          height: 32,
          marginRight: -10,
          backgroundColor: hinshiColors[unit.hinshi] || '',
        }}
      >
        <IconButton
          size="small"
          style={{ color: '#FF4E62' }}
          onClick={() => handleCollapse(unit.id)}
          onMouseDown={(e) => e.stopPropagation()}
        >
          <ChevronLeftRounded />
        </IconButton>
      </div>

      <WordPane text={foldedWordText} hinshi={unit.hinshi} cursor={cursor} />
    </div>
  );
};

export default FoldedWordPane;
