import { Collapse } from '@mui/material';
import React, { useState, useEffect, useCallback, createContext } from 'react';
import SentenceArrayPane from './components/SentenceArrayPane';
import SubSentenceArrayPane from './components/SubSentenceArrayPane';
import SubSentenceArraysHeader from './components/SubSentenceArraysHeader';

type Unit = {
  id: string;
  type: string;
  text: string;
  hinshi: string;
  branches: Branch[];
  isTaigendome: boolean;
  parentUnitId: string;
  setsuzokuJoshi: string;
  parentBranchJoshi: string;
};

type Branch = {
  lock?: boolean;
  border: string;
  unitId: string;
  unitType: string;
  joshiLabels: string[];
  isDraggable: boolean;
  isCommentMeishi: boolean;
};

// SentencePaneへ渡す用
type SentencePaneSentence = {
  id: string;
  buntouText: string;
  topicUnitId: string;
  hasBunmatsu: boolean;
  isTaigendome: boolean;
  bunmatsuText: string;
  commentUnitIds: string[];
  topicBranchUnitId: string;
};

type Sentence = {
  id: string;
  color: string;
  bodyTexts: string[];
  shuuJoshi: string;
  buntouText: string;
  juntaiJoshi: string;
  topicUnitId: string;
  topicBranch: Branch | null;
  isTaigendome: boolean;
  bunmatsuText: string;
  buntouSeibuns: {
    text: string;
    hinshi: string;
  }[];
  commentUnitIds: string[];
  juntaiJoshiBunmatsu: string;
};

export const ComplexSentencePaneContext = createContext<{
  units: { [unitId: string]: Unit };
  Cursor: any;
  sentences: { [id: string]: Sentence };
  sentenceTexts: { [sentenceId: string]: string };
  branchUnitIds: { [unitId: string]: string[] };
  parentUnitIds: { [unitId: string]: string };
  sentenceArrays: string[][];
  sentenceBodyTexts: { [sentenceId: string]: string[] };
  sentencePaneSentences: { [sentenceId: string]: SentencePaneSentence };
  sentenceCommentUnitIds: { [sentenceId: string]: string[] };
  setSentenceTexts: React.Dispatch<
    React.SetStateAction<{ [sentenceId: string]: string }>
  >;
  setSentenceBodyTexts: React.Dispatch<
    React.SetStateAction<{ [sentenceId: string]: string[] }>
  >;
}>({
  units: {},
  Cursor: null,
  sentences: {},
  branchUnitIds: {},
  sentenceTexts: {},
  parentUnitIds: {},
  sentenceArrays: [],
  sentenceBodyTexts: {},
  sentencePaneSentences: {},
  sentenceCommentUnitIds: {},
  setSentenceTexts: () => {},
  setSentenceBodyTexts: () => {},
});

export type ComplexSentencePaneProps = {
  units: { [unitId: string]: Unit };
  Cursor: any;
  sentences: { [id: string]: Sentence };
  sentenceArrays: string[][];
};

export function ComplexSentencePane({
  units,
  Cursor,
  sentences,
  sentenceArrays,
}: ComplexSentencePaneProps) {
  const [openSubSentences, setOpenSubSentnces] = useState(true);

  const [mainSentenceArray, setMainSentenceArray] = useState<string[]>([]);
  const [subSentenceArrays, setSubSentenceArrays] = useState<string[][]>([]);
  useEffect(() => {
    const [mainSentenceArray, ...subSentenceArrays] = sentenceArrays;
    setMainSentenceArray(mainSentenceArray);
    setSubSentenceArrays(subSentenceArrays);
  }, [sentenceArrays]);

  const [parentUnitIds, setParentUnitIds] = useState<{
    [unitId: string]: string;
  }>({});
  const [branchUnitIds, setBranchUnitIds] = useState<{
    [unitId: string]: string[];
  }>({});

  useEffect(() => {
    const parentUnitIds: { [unitId: string]: string } = {};
    const branchUnitIds: { [unitId: string]: string[] } = {};
    for (const unit of Object.values(units)) {
      parentUnitIds[unit.id] = unit.parentUnitId;
      branchUnitIds[unit.id] = unit.branches.map((branch) => branch.unitId);
    }
    setParentUnitIds(parentUnitIds);
    setBranchUnitIds(branchUnitIds);
  }, [units]);

  const [sentenceTexts, setSentenceTexts] = useState<{
    [sentenceId: string]: string;
  }>({});
  const [sentenceBodyTexts, setSentenceBodyTexts] = useState<{
    [sentenceId: string]: string[];
  }>({});
  const [sentenceCommentUnitIds, setSentenceCommentUnitIds] = useState<{
    [sentenceId: string]: string[];
  }>({});

  const [sentencePaneSentences, setSentencePaneSentences] = useState<{
    [id: string]: SentencePaneSentence;
  }>({});

  useEffect(() => {
    const sentenceTexts: { [sentenceId: string]: string } = {};
    const sentenceBodyTexts: { [sentenceId: string]: string[] } = {};
    const sentencePaneSentences: { [id: string]: SentencePaneSentence } = {};
    const sentenceCommentUnitIds: { [sentenceId: string]: string[] } = {};
    for (const sentence of Object.values(sentences)) {
      sentenceTexts[sentence.id] =
        sentence.bunmatsuText +
        sentence.bodyTexts.join('') +
        sentence.bunmatsuText;
      sentenceBodyTexts[sentence.id] = sentence.bodyTexts;
      sentencePaneSentences[sentence.id] = {
        ...sentence,
        hasBunmatsu: !!sentence.shuuJoshi || !!sentence.juntaiJoshi,
        topicBranchUnitId: sentence.topicBranch?.unitId || '',
      };
      sentenceCommentUnitIds[sentence.id] = sentence.commentUnitIds;
    }
    setSentenceTexts(sentenceTexts);
    setSentenceBodyTexts(sentenceBodyTexts);
    setSentencePaneSentences(sentencePaneSentences);
    setSentenceCommentUnitIds(sentenceCommentUnitIds);
  }, [sentences]);

  const onToggleOpenSubSentences = useCallback(() => {
    setOpenSubSentnces(!openSubSentences);
  }, [openSubSentences]);

  return (
    <ComplexSentencePaneContext.Provider
      value={{
        units,
        Cursor,
        sentences,
        sentenceTexts,
        branchUnitIds,
        parentUnitIds,
        sentenceArrays,
        sentenceBodyTexts,
        sentencePaneSentences,
        sentenceCommentUnitIds,
        setSentenceTexts,
        setSentenceBodyTexts,
      }}
    >
      <div style={{ display: 'flex' }}>
        <div
          style={{
            margin: '8px 0',
            border: '1px solid #A9D1D5',
            padding: 8,
            borderRadius: 8,
          }}
        >
          <div style={{ position: 'relative' }}>
            <div>
              {/* メイン */}
              <SentenceArrayPane
                sentenceArray={mainSentenceArray}
                sentenceArrayIndex={0}
              />

              {/* 解説 */}
              {!!subSentenceArrays.length && (
                <>
                  <div style={{ height: 12 }} />
                  <SubSentenceArraysHeader
                    onToggleOpenSubSentences={onToggleOpenSubSentences}
                    openSubSentences={openSubSentences}
                  />
                  <Collapse in={openSubSentences}>
                    <div style={{ height: 8 }} />
                    {subSentenceArrays.map((sentenceArray, index) => (
                      <div key={index}>
                        <SubSentenceArrayPane
                          sentenceArray={sentenceArray}
                          sentenceArrayIndex={index + 1}
                        />
                        {!!subSentenceArrays[index + 1] && (
                          <div style={{ height: 8 }} />
                        )}
                      </div>
                    ))}
                  </Collapse>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </ComplexSentencePaneContext.Provider>
  );
}
