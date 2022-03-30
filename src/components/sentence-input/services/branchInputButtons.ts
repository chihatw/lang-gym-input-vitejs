import { useContext } from 'react';
import { SentenceInputContext } from '../sentence-input';

export const useBranchInputButtons = () => {
  const { globalBranches, onChangeSentence } = useContext(SentenceInputContext);

  const onToggleLock = (branchID: string) => {
    const newBranches = { ...globalBranches };
    if (newBranches[branchID].lock) {
      delete newBranches[branchID].lock;
    } else {
      newBranches[branchID].lock = true;
    }
    onChangeSentence({
      newBranches,
    });
  };
  return { onToggleLock };
};
