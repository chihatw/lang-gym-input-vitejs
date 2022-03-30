import { useContext } from 'react';

import { Sentence } from '../entities/Sentence';
import { checkSubElements } from './checkSubElements';
import { SentenceInputContext } from '../sentence-input';
import { getSortedUnitIDs, getUnitText, Unit } from '../entities/Unit';

export const useCommentInput = () => {
  const {
    sentenceID,
    globalUnits,
    globalWords,
    globalBranches,
    globalSentences,
    onChangeSentence,
  } = useContext(SentenceInputContext);
  const onRemoveComment = (unitID: string) => {
    const sentence: Sentence | null = globalSentences[sentenceID];
    if (!sentence) return;
    let unitText = '';
    const sortedUnitIDs = getSortedUnitIDs({
      units: globalUnits,
      branches: globalBranches,
      unitID,
    });
    unitText = sortedUnitIDs
      .map((unitID) =>
        getUnitText({
          units: globalUnits,
          branches: globalBranches,
          words: globalWords,
          unitID,
        })
      )
      .join('');
    if (!unitText || window.confirm(`「${unitText}」を削除しますか`)) {
      const updatedComments = sentence.comments.filter((id) => id !== unitID);
      const newSentence: Sentence = { ...sentence, comments: updatedComments };

      const newUnits = { ...globalUnits };
      const newBranches = { ...globalBranches };
      const newWords = { ...globalWords };

      const deleteUnitIDs: string[] = [];
      const deleteBranchIDs: string[] = [];
      const deleteWordIDs: string[] = [];

      const commitUnit: Unit = globalUnits[unitID];
      deleteUnitIDs.push(commitUnit.id);
      deleteWordIDs.push(commitUnit.wordID);
      commitUnit.branchIDs.forEach((branchID) => {
        checkSubElements({
          branchID,
          globalUnits,
          deleteUnitIDs,
          deleteWordIDs,
          globalBranches,
          deleteBranchIDs,
        });
      });
      deleteUnitIDs.forEach((unitID) => {
        delete newUnits[unitID];
      });
      deleteBranchIDs.forEach((branchID) => {
        delete newBranches[branchID];
      });
      deleteWordIDs.forEach((wordID) => {
        delete newWords[wordID];
      });

      if (!updatedComments.length) {
        newSentence.shuuJoshi = '';
      }
      onChangeSentence({ newSentence, newUnits, newBranches, newWords });
    }
  };
  return { onRemoveComment };
};
