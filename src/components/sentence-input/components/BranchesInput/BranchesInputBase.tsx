import React, { useContext } from 'react';
import { DragDropContext, Droppable } from 'react-beautiful-dnd';

import { Unit } from '../../entities/Unit';
import BranchInput from '../BranchInput';
import BranchBorder from './BranchBorder';
import DraggableWrapper from './DraggableWrapper';
import BranchInputButtons from './BranchInputButtons';
import { SentenceInputContext } from '../../sentence-input';

const BranchesInputBase: React.FC<{
  unitID: string;
  isTopicBranch?: boolean;
  isRentaiBranch: boolean;
}> = ({ unitID, isTopicBranch, isRentaiBranch }) => {
  const { globalBranches, globalUnits, onDragEnd } =
    useContext(SentenceInputContext);
  const unit: Unit | null = globalUnits[unitID];
  const branchIDs = !!unit ? unit.branchIDs : [];

  const draggableBranchIDs = branchIDs.filter(
    (branchID) => !!globalBranches[branchID] && !globalBranches[branchID].lock
  );
  return (
    <DragDropContext onDragEnd={(result) => onDragEnd(result, unitID, true)}>
      <Droppable droppableId={unit.id}>
        {(provided) => (
          <div ref={provided.innerRef} {...provided.droppableProps}>
            {branchIDs.map((branchID, index) => (
              <DraggableWrapper
                key={branchID}
                index={index}
                draggableID={branchID}
                isDraggable={
                  draggableBranchIDs.length > 1 &&
                  !!globalBranches[branchID] &&
                  !globalBranches[branchID].lock
                }
              >
                <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                  <BranchBorder>
                    <div style={{ display: 'flex', alignItems: 'flex-end' }}>
                      <BranchInput branchID={branchID} />
                      <BranchInputButtons
                        branchID={branchID}
                        branchIDs={branchIDs}
                        isTopicBranch={isTopicBranch}
                        isRentaiBranch={isRentaiBranch}
                      />
                    </div>
                  </BranchBorder>
                </div>
                {!!branchIDs[index + 1] && <div style={{ height: 4 }} />}
              </DraggableWrapper>
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
};

export default BranchesInputBase;
