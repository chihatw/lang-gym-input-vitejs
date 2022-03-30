import { DraggableLocation } from 'react-beautiful-dnd';
import { updateSentenceTexts } from './updateSentenceTexts';

export function handleDrag({
  type,
  units,
  unitId,
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
}: {
  type: 'update' | 'end';
  units: {
    [id: string]: {
      id: string;
      text: string;
      parentUnitId: string;
      setsuzokuJoshi: string;
      parentBranchJoshi: string;
    };
  };
  unitId: string;
  source: DraggableLocation;
  sentences: {
    [id: string]: {
      id: string;
      buntouText: string;
      topicUnitId: string;
      hasBunmatsu: boolean;
      isTaigendome: boolean;
      bunmatsuText: string;
      commentUnitIds: string[];
      topicBranchUnitId: string;
    };
  };
  sentenceId: string;
  destination: DraggableLocation;
  branchUnitIds: { [unitId: string]: string[] };
  sentenceArray: string[];
  isMainSentence: boolean;
  invisibleUnitIds: string[];
  superSentenceTexts?: { [sentenceId: string]: string };
  isMainSentenceArray: boolean;
  superSentenceBodyTexts?: { [sentenceId: string]: string[] };
  setBranchUnitIds: React.Dispatch<
    React.SetStateAction<{ [unitId: string]: string[] }>
  >;
  setBodyTexts: React.Dispatch<React.SetStateAction<string[]>>;
  superSetSentenceTexts?: React.Dispatch<
    React.SetStateAction<{ [sentenceId: string]: string }>
  >;
  superSetSentenceBodyTexts?: React.Dispatch<
    React.SetStateAction<{ [sentenceId: string]: string[] }>
  >;
}): void {
  const sentence = sentences[sentenceId];
  // branchesからbranch.idを抽出
  let newUnitIDs = [...branchUnitIds[unitId]];
  // dragした要素を削除する
  newUnitIDs = newUnitIDs.filter((_, index) => index !== source.index);
  // 削除した要素をDropした場所に挿入する
  newUnitIDs.splice(destination.index, 0, branchUnitIds[unitId][source.index]);

  const newBranchUnitIds: { [unitId: string]: string[] } = JSON.parse(
    JSON.stringify(branchUnitIds)
  );
  newBranchUnitIds[unitId] = newUnitIDs;

  // ドラッグ中の場合は、bodyTexts, sentenceText を更新
  if (type === 'update') {
    updateSentenceTexts({
      units,
      sentenceId: sentence.id,
      sentences,
      branchUnitIds: newBranchUnitIds,
      sentenceArray,
      isMainSentence,
      invisibleUnitIds,
      superSentenceTexts,
      isMainSentenceArray,
      superSentenceBodyTexts,
      setBodyTexts,
      superSetSentenceTexts,
      superSetSentenceBodyTexts,
    });
  }
  // ドラッグ終了の場合は、branchIds を更新
  // bodyTexts, sentenceText はドラッグ中に更新されているのでそのまま
  else {
    setBranchUnitIds(newBranchUnitIds);
  }
}
