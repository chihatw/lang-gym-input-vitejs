import { useContext } from 'react';
import { SentenceInputContext } from '../sentence-input';

export const useBuntouSeibunsInput = () => {
  const { globalSentences, sentenceID, onChangeSentence } =
    useContext(SentenceInputContext);
  const onRemoveBuntouSeibun = (wordID: string) => {
    const newSentence = { ...globalSentences[sentenceID] };
    newSentence.buntouSeibuns = newSentence.buntouSeibuns.filter(
      (id) => id !== wordID
    );
    onChangeSentence({
      newSentence,
    });
  };
  return {
    onRemoveBuntouSeibun,
  };
};
