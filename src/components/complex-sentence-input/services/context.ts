import { createContext } from 'react';
import { Branch } from '../entities/Branch';
import { Sentence } from '../entities/Sentence';
import { Unit } from '../entities/Unit';
import { Word } from '../entities/Word';

export const ComplexSentenceInputContext = createContext<{
  sentenceID: string;
  globalUnits: { [id: string]: Unit };
  globalWords: { [id: string]: Word };
  setGlobalUnits: React.Dispatch<React.SetStateAction<{ [id: string]: Unit }>>;
  setGlobalWords: React.Dispatch<React.SetStateAction<{ [id: string]: Word }>>;
  globalBranches: { [id: string]: Branch };
  globalSentences: { [id: string]: Sentence };
  activeSentenceID: string;
  setGlobalBranches: React.Dispatch<
    React.SetStateAction<{ [id: string]: Branch }>
  >;
  setGlobalSentences: React.Dispatch<
    React.SetStateAction<{ [id: string]: Sentence }>
  >;
  setActiveSentenceID: React.Dispatch<React.SetStateAction<string>>;
  globalSentenceArrays: string[][];
  setGlobalSentenceArrays: React.Dispatch<React.SetStateAction<string[][]>>;
}>({
  sentenceID: '',
  globalUnits: {},
  globalWords: {},
  setGlobalUnits: () => {},
  setGlobalWords: () => {},
  globalBranches: {},
  globalSentences: {},
  activeSentenceID: '',
  setGlobalBranches: () => {},
  setGlobalSentences: () => {},
  setActiveSentenceID: () => {},
  globalSentenceArrays: [],
  setGlobalSentenceArrays: () => {},
});
