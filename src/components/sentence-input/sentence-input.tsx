import React, { createContext } from 'react';
import { DropResult } from 'react-beautiful-dnd';

import ToolBar from './components/ToolBar';
import { Word } from './entities/Word';
import { Unit } from './entities/Unit';
import { Branch } from './entities/Branch';
import { Sentence } from './entities/Sentence';
import SentenceInputBody from './components/SentenceInputBody';
import { useSentenceInput } from './services/sentenceInput';
import KeyboardShortcutWrapper from './components/KeyboardShortcutWrapper';

export const SentenceInputContext = createContext<{
  sentenceID: string;
  globalUnits: { [id: string]: Unit };
  globalWords: { [id: string]: Word };
  globalBranches: { [id: string]: Branch };
  isLastSentence: boolean;
  globalSentences: { [id: string]: Sentence };
  isFirstSentence: boolean;
  isActiveSentence: boolean;
  hasJuntaiJoshiBunmatsu: boolean;
  onAddTopic: () => void;
  onAddComment: () => void;
  onRemoveTopic: () => void;
  onAddShuuJoshi: () => void;
  onRemoveBranch: (branchID: string) => void;
  onChangeHinshi: (unitID: string, wordID: string, hinshi: string) => void;
  onDeleteSentence: () => void;
  onAddBuntouSeibun: () => void;
  onRemoveShuuJoshi: () => void;
  onAddDoushiBranch: (unitID: string) => void;
  onAddDoushiComment: () => void;
  onToggleJuntaiJoshi: () => void;
  onSetActiveSentence: () => void;
  onRemoveBuntouSeibuns: () => void;
  onAddMeishiRentaiBranch: (unitID: string) => void;
  onAddJuntaiJoshiBunmatsu: () => void;
  onRemoveJuntaiJoshiBunmatsu: () => void;
  onAddMeishiRenyouBranch: ({
    unitID,
    kakuJoshi,
    kakariJoshi,
  }: {
    unitID: string;
    kakuJoshi: string;
    kakariJoshi: string;
  }) => void;

  onChangeSentence: ({
    newSentence,
    newUnits,
    newBranches,
    newWords,
    doNotUpdateSentenceGlobalJSONs,
  }: {
    newSentence?: Sentence;
    newUnits?: { [id: string]: Unit };
    newBranches?: { [id: string]: Branch };
    newWords?: { [id: string]: Word };
    doNotUpdateSentenceGlobalJSONs?: boolean;
  }) => void;
  onDragEnd: (
    result: DropResult,
    unitID: string,
    isRenyouBranch?: boolean
  ) => void;
}>({
  sentenceID: '',
  globalUnits: {},
  globalWords: {},
  globalBranches: {},
  globalSentences: {},
  isLastSentence: true,
  isFirstSentence: true,
  isActiveSentence: false,
  hasJuntaiJoshiBunmatsu: false,
  onDragEnd: () => {},
  onAddTopic: () => {},
  onAddComment: () => {},
  onRemoveTopic: () => {},
  onAddShuuJoshi: () => {},
  onRemoveBranch: () => {},
  onChangeHinshi: () => {},
  onDeleteSentence: () => {},
  onChangeSentence: () => {},
  onAddBuntouSeibun: () => {},
  onAddDoushiBranch: () => {},
  onRemoveShuuJoshi: () => {},
  onAddDoushiComment: () => {},
  onSetActiveSentence: () => {},
  onToggleJuntaiJoshi: () => {},
  onRemoveBuntouSeibuns: () => {},
  onAddMeishiRentaiBranch: () => {},
  onAddMeishiRenyouBranch: () => {},
  onAddJuntaiJoshiBunmatsu: () => {},
  onRemoveJuntaiJoshiBunmatsu: () => {},
});

export type SentenceInputProps = {
  maxWidth?: number;
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
};

export function SentenceInput({
  maxWidth,
  sentenceID,
  globalUnits,
  globalWords,
  setGlobalUnits,
  setGlobalWords,
  globalBranches,
  globalSentences,
  activeSentenceID,
  setGlobalBranches,
  setGlobalSentences,
  setActiveSentenceID,
  globalSentenceArrays,
  setGlobalSentenceArrays,
}: SentenceInputProps) {
  const {
    onDragEnd,
    onAddTopic,
    onAddComment,
    onRemoveTopic,
    onAddShuuJoshi,
    onRemoveBranch,
    onChangeHinshi,
    isLastSentence,
    isFirstSentence,
    onDeleteSentence,
    onChangeSentence,
    isActiveSentence,
    onRemoveShuuJoshi,
    onAddBuntouSeibun,
    onAddDoushiBranch,
    onAddDoushiComment,
    onToggleJuntaiJoshi,
    onSetActiveSentence,
    onRemoveBuntouSeibuns,
    hasJuntaiJoshiBunmatsu,
    onAddMeishiRenyouBranch,
    onAddMeishiRentaiBranch,
    onAddJuntaiJoshiBunmatsu,
    onRemoveJuntaiJoshiBunmatsu,
  } = useSentenceInput({
    sentenceID,
    globalUnits,
    globalWords,
    setGlobalUnits,
    setGlobalWords,
    globalBranches,
    globalSentences,
    activeSentenceID,
    setGlobalBranches,
    setGlobalSentences,
    setActiveSentenceID,
    globalSentenceArrays,
    setGlobalSentenceArrays,
  });
  return (
    <SentenceInputContext.Provider
      value={{
        onDragEnd,
        onAddTopic,
        sentenceID,
        globalUnits,
        globalWords,
        onAddComment,
        onRemoveTopic,
        onChangeHinshi,
        onRemoveBranch,
        onAddShuuJoshi,
        isLastSentence,
        globalBranches,
        isFirstSentence,
        globalSentences,
        onDeleteSentence,
        onChangeSentence,
        isActiveSentence,
        onRemoveShuuJoshi,
        onAddBuntouSeibun,
        onAddDoushiBranch,
        onAddDoushiComment,
        onToggleJuntaiJoshi,
        onSetActiveSentence,
        onRemoveBuntouSeibuns,
        hasJuntaiJoshiBunmatsu,
        onAddMeishiRenyouBranch,
        onAddMeishiRentaiBranch,
        onAddJuntaiJoshiBunmatsu,
        onRemoveJuntaiJoshiBunmatsu,
      }}
    >
      <KeyboardShortcutWrapper>
        <div style={{ display: 'flex' }}>
          <div
            style={{
              border: `1px dashed ${isActiveSentence ? 'pink' : '#ccc'}`,
              padding: 8,
              borderRadius: 4,
            }}
          >
            <ToolBar />
            <div style={{ height: 8 }} />
            <div style={{ maxWidth: maxWidth || 720, overflowX: 'scroll' }}>
              <SentenceInputBody />
            </div>
          </div>
        </div>
      </KeyboardShortcutWrapper>
    </SentenceInputContext.Provider>
  );
}
