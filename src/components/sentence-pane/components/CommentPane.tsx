import React, { useContext } from 'react';

import UnitSwitch from './UnitSwitch';
import { SentencePaneContext } from '../sentence-pane';

const CommentPane: React.FC<{
  unitId: string;
  hasMultipleComments: boolean;
}> = ({ unitId, hasMultipleComments }) => {
  const { units, invisibleUnitIds } = useContext(SentencePaneContext);
  const unit = units[unitId];
  return (
    <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
      <div
        style={{
          opacity: invisibleUnitIds.includes(unitId) ? 0.3 : 1,
        }}
      >
        <DashedBorder hasMultipleComments={hasMultipleComments}>
          <div
            style={{
              display: 'flex',
              flexWrap: 'nowrap',
              alignItems: 'flex-end',
            }}
          >
            <UnitSwitch unitId={unitId} />
            {!!unit.setsuzokuJoshi && (
              <SetsuzokuJoshiPane label={unit.setsuzokuJoshi} />
            )}
          </div>
        </DashedBorder>
      </div>
    </div>
  );
};

export default CommentPane;

const DashedBorder: React.FC<{
  hasMultipleComments: boolean;
}> = ({ children, hasMultipleComments }) => {
  if (hasMultipleComments) {
    return (
      <div
        style={{ border: '1px dashed #52a2aa', borderRadius: 4, padding: 4 }}
      >
        {children}
      </div>
    );
  } else {
    return <div>{children}</div>;
  }
};

const SetsuzokuJoshiPane: React.FC<{
  label: string;
}> = ({ label }) => {
  return (
    <div
      style={{
        color: 'white',
        height: '32px',
        border: '1px solid transparent',
        zIndex: -1,
        padding: '6px 10px',
        fontSize: 12,
        boxSizing: 'border-box',
        marginLeft: 4,
        fontWeight: 500,
        lineHeight: '20px',
        userSelect: 'none',
        whiteSpace: 'nowrap',
        backgroundColor: '#00a89d',
      }}
    >
      {label}
    </div>
  );
};
