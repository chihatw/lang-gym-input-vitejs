import { DropResult, DragUpdate } from 'react-beautiful-dnd';
import React, {
  useRef,
  useState,
  useEffect,
  useCallback,
  createContext,
} from 'react';
import { Collapse } from '@mui/material';

import SentenceBody from './components/SentenceBody';
import BuntouSeibuns from './components/BuntouSeibuns';
import SentenceHeader from './components/SentenceHeader';
import BunmatsuSeibun from './components/BunmatsuSeibun';
import SentenceHeaderTail from './components/SentenceHeaderTail';
import TopicCommentsBorder from './components/TopicCommentsBorder';

import { handleDrag } from './services/handleDrag';
import { updateSentenceTexts } from './services/updateSentenceTexts';

type Unit = {
  id: string;
  type: string;
  text: string;
  hinshi: string;
  branches: {
    lock?: boolean;
    border: string;
    unitId: string;
    unitType: string;
    joshiLabels: string[];
    isDraggable: boolean;
    isCommentMeishi: boolean;
  }[];
  isTaigendome: boolean;
  parentUnitId: string;
  setsuzokuJoshi: string;
  parentBranchJoshi: string;
};

type Sentence = {
  id: string;
  buntouText: string;
  topicUnitId: string;
  hasBunmatsu: boolean;
  isTaigendome: boolean;
  bunmatsuText: string;
  commentUnitIds: string[];
  topicBranchUnitId: string;
};

export const SentencePaneContext = createContext<{
  units: { [id: string]: Unit };
  cursor: string;
  sentenceId: string;
  openSentence: boolean;
  branchUnitIds: { [unitId: string]: string[] };
  parentUnitIds: { [unitId: string]: string };
  collapsedUnitIds: string[];
  invisibleUnitIds: string[];
  sentenceArrayIndex: number;
  sentenceCommentUnitIds: { [sentenceId: string]: string[] };
  handleVisible: (unitId: string) => void;
  handleDragEnd: (result: DropResult) => void;
  handleCollapse: (unitId: string) => void;
  handleDragUpdate: (update: DragUpdate) => void;
  handleOpenSentence: () => void;
}>({
  units: {},
  cursor: '',
  sentenceId: '',
  openSentence: true,
  branchUnitIds: {},
  parentUnitIds: {},
  collapsedUnitIds: [],
  invisibleUnitIds: [],
  sentenceArrayIndex: 0,
  sentenceCommentUnitIds: {},
  handleVisible: () => {},
  handleDragEnd: () => {},
  handleCollapse: () => {},
  handleDragUpdate: () => {},
  handleOpenSentence: () => {},
});

export type SentencePaneProps = {
  units: { [unitId: string]: Unit };
  color: string;
  Cursor: any;
  bodyTexts: string[];
  shuuJoshi: string;
  sentences: { [sentenceId: string]: Sentence };
  sentenceId: string;
  topicUnitId: string;
  juntaiJoshi: string;
  topicBranch: {
    lock?: boolean;
    border: string;
    unitId: string;
    unitType: string;
    joshiLabels: string[];
    isDraggable: boolean;
  } | null;
  isTaigendome: boolean;
  branchUnitIds: { [unitId: string]: string[] };
  buntouSeibuns: {
    text: string;
    hinshi: string;
  }[];
  parentUnitIds: { [unitId: string]: string };
  sentenceArray: string[];
  commentUnitIds: string[];
  isMainSentence: boolean;
  superSentenceTexts?: { [sentenceId: string]: string };
  sentenceArrayIndex: number;
  isMainSentenceArray: boolean;
  juntaiJoshiBunmatsu: string;
  sentenceCommentUnitIds: { [sentenceId: string]: string[] };
  superSentenceBodyTexts?: { [sentenceId: string]: string[] };
  superSetSentenceTexts?: React.Dispatch<
    React.SetStateAction<{ [sentenceId: string]: string }>
  >;
  superSetSentenceBodyTexts?: React.Dispatch<
    React.SetStateAction<{ [sentenceId: string]: string[] }>
  >;
};

export function SentencePane({
  units,
  color,
  Cursor,
  sentences,
  bodyTexts: _bodyTexts,
  shuuJoshi,
  sentenceId,
  topicUnitId,
  topicBranch,
  juntaiJoshi,
  isTaigendome,
  buntouSeibuns,
  parentUnitIds,
  branchUnitIds: _branchUnitIds,
  sentenceArray,
  commentUnitIds,
  isMainSentence,
  superSentenceTexts,
  sentenceArrayIndex,
  isMainSentenceArray,
  juntaiJoshiBunmatsu,
  sentenceCommentUnitIds,
  superSentenceBodyTexts,
  superSetSentenceTexts,
  superSetSentenceBodyTexts,
}: SentencePaneProps) {
  const [bodyTexts, setBodyTexts] = useState<string[]>([]);
  const [openSentence, setOpenSentence] = useState(true);
  const [branchUnitIds, setBranchUnitIds] = useState<{
    [unitId: string]: string[];
  }>({});
  const [collapsedUnitIds, setCollapsedUnitIds] = useState<string[]>([]);
  const [invisibleUnitIds, setInvisibleUnitIds] = useState<string[]>([]);

  useEffect(() => {
    setBodyTexts(_bodyTexts);
  }, [_bodyTexts]);

  useEffect(() => {
    setBranchUnitIds(_branchUnitIds);
  }, [_branchUnitIds]);

  const headerEl = useRef<HTMLDivElement>(null);
  const [headerHeight, setHeaderHeight] = useState(32);

  const mesureRef = useCallback((node: HTMLDivElement) => {
    if (node !== null) {
      setHeaderHeight(node.getBoundingClientRect().height);
    }
  }, []);

  const resizeHeader = () => {
    if (!!headerEl.current) {
      const headerHeight = headerEl.current.getBoundingClientRect().height;
      setHeaderHeight(headerHeight);
    }
  };

  useEffect(() => {
    window.addEventListener('resize', resizeHeader);
  }, []);

  const handleDragUpdate = ({ destination, source }: DragUpdate) => {
    // Dropされなかった場合は処理終了
    if (!destination) return;
    const unit = units[source.droppableId];
    if (!unit) return;
    handleDrag({
      type: 'update',
      units,
      unitId: unit.id,
      source,
      sentences,
      sentenceId,
      destination,
      branchUnitIds,
      sentenceArray,
      isMainSentence,
      invisibleUnitIds,
      superSentenceTexts,
      isMainSentenceArray,
      superSentenceBodyTexts,
      setBodyTexts,
      setBranchUnitIds,
      superSetSentenceTexts,
      superSetSentenceBodyTexts,
    });
  };

  const handleDragEnd = ({ destination, source }: DropResult) => {
    // Dropされなかった場合、または元のリストにDropされた場合は、処理終了
    if (
      !destination ||
      (source.droppableId === destination.droppableId &&
        destination.index === source.index)
    )
      return;

    const unit = units[source.droppableId];
    if (!unit) return;

    handleDrag({
      type: 'end',
      units,
      unitId: unit.id,
      source,
      sentences,
      sentenceId,
      destination,
      branchUnitIds,
      sentenceArray,
      isMainSentence,
      invisibleUnitIds,
      superSentenceTexts,
      isMainSentenceArray,
      superSentenceBodyTexts,
      setBodyTexts,
      setBranchUnitIds,
      superSetSentenceTexts,
      superSetSentenceBodyTexts,
    });
  };

  const handleCollapse = (unitId: string) => {
    let unitIds = [...collapsedUnitIds];
    if (unitIds.includes(unitId)) {
      unitIds = unitIds.filter((_unitId) => _unitId !== unitId);
    } else {
      unitIds.push(unitId);
    }
    setCollapsedUnitIds(unitIds);
  };

  const handleVisible = (unitId: string) => {
    let newInvisibleUnitIds = [...invisibleUnitIds];
    if (newInvisibleUnitIds.includes(unitId)) {
      newInvisibleUnitIds = newInvisibleUnitIds.filter(
        (_unitId) => _unitId !== unitId
      );
    } else {
      newInvisibleUnitIds.push(unitId);
    }
    setInvisibleUnitIds(newInvisibleUnitIds);

    updateSentenceTexts({
      units,
      sentences,
      sentenceId,
      branchUnitIds,
      sentenceArray,
      isMainSentence,
      invisibleUnitIds: newInvisibleUnitIds,
      superSentenceTexts,
      isMainSentenceArray,
      superSentenceBodyTexts,
      setBodyTexts,
      superSetSentenceTexts,
      superSetSentenceBodyTexts,
    });
  };

  const handleOpenSentence = () => {
    setOpenSentence(!openSentence);
  };

  return (
    <SentencePaneContext.Provider
      value={{
        units,
        cursor: `url(${Cursor}), auto`,
        sentenceId,
        openSentence,
        branchUnitIds,
        parentUnitIds,
        collapsedUnitIds,
        invisibleUnitIds,
        sentenceArrayIndex,
        sentenceCommentUnitIds,
        handleVisible,
        handleDragEnd,
        handleCollapse,
        handleDragUpdate,
        handleOpenSentence,
      }}
    >
      <div style={{ display: 'flex', flexWrap: 'nowrap' }}>
        {!!buntouSeibuns.length && <BuntouSeibuns words={buntouSeibuns} />}

        <div style={{ marginRight: -12, zIndex: 1 }}>
          {!!bodyTexts.join('') && (!!topicUnitId || !!commentUnitIds.length) && (
            <div style={{ display: 'flex' }}>
              <div style={{ marginRight: 12 }}>
                <SentenceHeaderTail
                  color={color}
                  headerHeight={headerHeight}
                  isTaigendome={isTaigendome}
                >
                  {!isTaigendome && (
                    <SentenceHeader
                      headerEl={headerEl}
                      bodyTexts={bodyTexts}
                      mesureRef={mesureRef}
                      backgroundColor={color}
                    />
                  )}
                  <Collapse in={openSentence}>
                    {!!topicUnitId && <TopicCommentsBorder color={color} />}
                    <SentenceBody
                      color={color}
                      joshiLabels={!!topicBranch ? topicBranch.joshiLabels : []}
                      isTaigendome={isTaigendome}
                      hasTopicBranch={!!topicBranch}
                      commentUnitIds={commentUnitIds}
                      topicBranchUnitId={
                        !!topicBranch ? topicBranch.unitId : ''
                      }
                      hasMultipleComments={commentUnitIds.length > 1}
                    />
                    {!isTaigendome && <div style={{ height: 12 }} />}
                  </Collapse>
                </SentenceHeaderTail>
              </div>
            </div>
          )}
        </div>
        {!!juntaiJoshi && <BunmatsuSeibun>{juntaiJoshi}</BunmatsuSeibun>}
        {!!juntaiJoshiBunmatsu && (
          <BunmatsuSeibun>{juntaiJoshiBunmatsu}</BunmatsuSeibun>
        )}
        {!!shuuJoshi && <BunmatsuSeibun>{shuuJoshi}</BunmatsuSeibun>}
      </div>
    </SentencePaneContext.Provider>
  );
}
