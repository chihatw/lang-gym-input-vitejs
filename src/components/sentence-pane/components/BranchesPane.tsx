import React, { useContext } from 'react';
import {
  Droppable,
  Draggable,
  DragDropContext,
  DraggableProvided,
  DroppableStateSnapshot,
} from 'react-beautiful-dnd';

import BranchPane from './BranchPane';
import { SentencePaneContext } from '../sentence-pane';

const BranchesPane: React.FC<{
  unitId: string;
  branches: {
    border: string;
    unitId: string;
    joshiLabels: string[];
    isDraggable: boolean;
    isCommentMeishi: boolean;
  }[];
}> = ({ unitId, branches }) => {
  const { handleDragUpdate, handleDragEnd } = useContext(SentencePaneContext);
  return (
    <DragDropContext onDragEnd={handleDragEnd} onDragUpdate={handleDragUpdate}>
      <Droppable droppableId={unitId}>
        {(provided, snapshot) => (
          <div ref={provided.innerRef} {...provided.droppableProps}>
            <DroppableAreaBorderWrapper snapshot={snapshot}>
              <div style={{ display: 'grid', rowGap: 4 }}>
                {branches
                  .filter((branch) => branch)
                  .map((branch, index) => {
                    if (branch.isDraggable) {
                      return (
                        <Draggable
                          // key に index 使用不可
                          key={branch.unitId}
                          index={index}
                          draggableId={branch.unitId}
                        >
                          {(provided) => (
                            <div
                              {...provided.draggableProps}
                              ref={provided.innerRef}
                            >
                              <BranchContainer
                                border={branch.border}
                                unitId={branch.unitId}
                                provided={provided}
                                joshiLabels={branch.joshiLabels}
                                isCommentMeishi={branch.isCommentMeishi}
                              />
                            </div>
                          )}
                        </Draggable>
                      );
                    } else {
                      return (
                        <BranchContainer
                          // key に index 使用不可
                          key={branch.unitId}
                          border={branch.border}
                          unitId={branch.unitId}
                          provided={undefined}
                          joshiLabels={branch.joshiLabels}
                          isCommentMeishi={branch.isCommentMeishi}
                        />
                      );
                    }
                  })}
                {provided.placeholder}
              </div>
            </DroppableAreaBorderWrapper>
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
};

export default BranchesPane;

const BranchContainer: React.FC<{
  border: string;
  unitId: string;
  provided: DraggableProvided | undefined;
  joshiLabels: string[];
  isCommentMeishi: boolean;
}> = ({ border, unitId, provided, joshiLabels, isCommentMeishi }) => {
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'flex-end', //　右寄せのため
      }}
    >
      <div
        style={{
          border: !!border ? border : 'none',
          padding: !!border ? 2 : 0,
        }}
      >
        <BranchPane
          unitId={unitId}
          joshiLabels={joshiLabels}
          isCommentMeishi={isCommentMeishi}
          dragHandleProps={!!provided ? provided.dragHandleProps : undefined}
        />
      </div>
    </div>
  );
};

const DroppableAreaBorderWrapper: React.FC<{
  snapshot: DroppableStateSnapshot;
}> = ({ children, snapshot }) => {
  return (
    <div
      style={{
        boxSizing: 'border-box',
        marginTop: -1,
        marginBottom: -1,
        border: snapshot.isDraggingOver
          ? '1px dashed pink'
          : '1px solid transparent',
      }}
    >
      {children}
    </div>
  );
};
