import React, { useContext } from 'react';

import CommentInput from './CommentInput';
import DraggableWrapper from './BranchesInput/DraggableWrapper';
import { useCommentsInput } from '../services/commentsInput';
import { SentenceInputContext } from '../sentence-input';
import { DragDropContext, Droppable } from 'react-beautiful-dnd';

const CommentsInput: React.FC = () => {
  const { onDragEnd } = useCommentsInput();
  const { sentenceID, globalSentences } = useContext(SentenceInputContext);
  const sentence = globalSentences[sentenceID];
  if (!!sentence && !!sentence.comments.length) {
    return (
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId={sentence.id}>
          {(provided) => (
            <div ref={provided.innerRef} {...provided.droppableProps}>
              {sentence.comments.map((unitID, index) => (
                <DraggableWrapper
                  index={index}
                  draggableID={unitID}
                  isDraggable={sentence.comments.length > 1}
                  key={unitID}
                >
                  <CommentInput unitID={unitID} />
                  {!!sentence.comments[index + 1] && (
                    <div style={{ height: 4 }} />
                  )}
                </DraggableWrapper>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    );
  } else {
    return <div />;
  }
};
export default CommentsInput;
