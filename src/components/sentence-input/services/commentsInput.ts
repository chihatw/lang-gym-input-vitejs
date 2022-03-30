import { useContext } from 'react';
import { DropResult } from 'react-beautiful-dnd';

import { Sentence } from '../entities/Sentence';
import { SentenceInputContext } from '../sentence-input';

export const useCommentsInput = () => {
  const { sentenceID, globalSentences, onChangeSentence } =
    useContext(SentenceInputContext);

  const onDragEnd = (result: DropResult) => {
    const { destination, source, draggableId } = result;
    if (!destination) return;
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    )
      return;

    const sentence: Sentence | null = globalSentences[sentenceID];
    if (!sentence) return;
    const newComments = [...sentence.comments];
    newComments.splice(source.index, 1);
    newComments.splice(destination.index, 0, draggableId);

    const newSentence = { ...sentence };
    newSentence.comments = newComments;

    onChangeSentence({ newSentence });
  };
  return { onDragEnd };
};
