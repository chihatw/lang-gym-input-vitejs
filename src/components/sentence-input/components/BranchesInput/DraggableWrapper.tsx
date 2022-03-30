import React from 'react';
import { Draggable } from 'react-beautiful-dnd';

const DraggableWrapper: React.FC<{
  isDraggable: boolean;
  draggableID: string;
  index: number;
}> = ({ children, isDraggable, draggableID, index }) => {
  if (isDraggable) {
    return (
      <Draggable draggableId={draggableID} index={index}>
        {(provided) => (
          <div
            {...provided.draggableProps}
            {...provided.dragHandleProps}
            ref={provided.innerRef}
          >
            {children}
          </div>
        )}
      </Draggable>
    );
  } else {
    return <div>{children}</div>;
  }
};

export default DraggableWrapper;
