import React, { useContext, useState } from 'react';
import { DraggableProvidedDragHandleProps } from 'react-beautiful-dnd';
import { SentencePaneContext } from '../sentence-pane';

import UnitSwitch from './UnitSwitch';

const BranchPane: React.FC<{
  unitId: string;
  joshiLabels: string[];
  isCommentMeishi: boolean;
  dragHandleProps?: DraggableProvidedDragHandleProps;
  topicBorderColor?: string;
}> = ({
  unitId,
  joshiLabels,
  dragHandleProps,
  isCommentMeishi,
  topicBorderColor,
}) => {
  const { units, parentUnitIds, invisibleUnitIds, handleVisible } =
    useContext(SentencePaneContext);
  const parentUnitId = parentUnitIds[unitId];
  const parentUnit = units[parentUnitId];
  if (!!parentUnit) {
    return (
      <div style={{ opacity: invisibleUnitIds.includes(unitId) ? 0.3 : 1 }}>
        <div
          style={{
            display: 'flex',
            flexWrap: 'nowrap',
            alignItems: 'flex-end',
          }}
        >
          <BranchUnit
            unitId={unitId}
            topicBorderColor={topicBorderColor}
            disabled={
              // 親が名詞文末ではない場合、体言止めの時は onToggleVisibility のためにクリック可の状態にする
              parentUnit.hinshi === 'meishibunmatsu' && !parentUnit.isTaigendome
            }
            handleClick={
              // 親が名詞文末ではない場合、ブランチは非表示にできる
              parentUnit.hinshi !== 'meishibunmatsu'
                ? () => handleVisible(unitId)
                : undefined
            }
          />
          {isCommentMeishi && <div style={{ width: 2 }} />}
          {!isCommentMeishi && (
            <BranchJoshis
              labels={joshiLabels}
              dragHandleProps={dragHandleProps}
            />
          )}
        </div>
      </div>
    );
  } else {
    return <></>;
  }
};

export default BranchPane;

const BranchUnit: React.FC<{
  unitId: string;
  disabled: boolean;
  handleClick?: () => void;
  topicBorderColor?: string;
}> = ({ unitId, disabled, handleClick, topicBorderColor }) => {
  const { cursor } = useContext(SentencePaneContext);
  const [mouseDownX, setMouseDownX] = useState(0);
  const [mouseDownY, setMouseDownY] = useState(0);
  const handleMouseDown = (e: React.MouseEvent<HTMLElement, MouseEvent>) => {
    e.stopPropagation();
    setMouseDownX(e.clientX);
    setMouseDownY(e.clientY);
  };
  const handleMouseUp = (e: React.MouseEvent<HTMLElement, MouseEvent>) => {
    e.stopPropagation();
    if (e.clientX === mouseDownX && e.clientY === mouseDownY) {
      !!handleClick && handleClick();
    }
  };
  return (
    <div
      style={{
        zIndex: 2,
        cursor,
        display: 'flex',
        flexDirection: 'column',
        pointerEvents: !disabled ? 'auto' : 'none',
      }}
      onMouseUp={handleMouseUp}
      onMouseDown={handleMouseDown}
      onTouchEnd={(e) => e.stopPropagation()}
      onTouchStart={(e) => e.stopPropagation()}
    >
      <div
        style={{
          border: topicBorderColor ? `2px solid ${topicBorderColor}` : 'none',
          padding: topicBorderColor ? 4 : 0,
          borderRadius: 8,
        }}
      >
        <UnitSwitch unitId={unitId} />
      </div>
    </div>
  );
};

const BranchJoshis: React.FC<{
  labels: string[];
  dragHandleProps?: DraggableProvidedDragHandleProps;
}> = ({ dragHandleProps, labels }) => {
  return (
    <div style={{ display: 'flex' }} {...dragHandleProps}>
      {labels.map((label, index) => (
        <div
          id={`handle_${index}`}
          key={index}
          style={{ display: 'flex' }}
          onMouseDown={(e) => e.stopPropagation()}
        >
          <div style={{ width: 2 }} />
          <JoshiPane label={label} />
        </div>
      ))}
    </div>
  );
};

const JoshiPane: React.FC<{ label: string }> = ({ label }) => {
  return (
    <div
      style={{
        width: 34,
        height: 30,
        border: '1px solid #52a2aa',
      }}
    >
      <div
        style={{
          textAlign: 'center',
          lineHeight: '32px',
          fontSize: 12,
          transform: label.length > 2 ? 'scale(0.7,0.7)' : 'scale(1,1)',
          margin: label.length > 2 ? '0 -8px' : 0,
          userSelect: 'none',
        }}
      >
        {label}
      </div>
    </div>
  );
};
