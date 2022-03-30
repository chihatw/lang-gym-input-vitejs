import { getBodyTexts } from './getBodyTexts';

export function updateSentenceTexts({
  units,
  sentences,
  sentenceId,
  branchUnitIds,
  sentenceArray,
  isMainSentence,
  invisibleUnitIds,
  superSentenceTexts,
  isMainSentenceArray,
  superSentenceBodyTexts,
  setBodyTexts,
  superSetSentenceTexts,
  superSetSentenceBodyTexts,
}: {
  units: {
    [id: string]: {
      id: string;
      text: string;
      parentUnitId: string;
      setsuzokuJoshi: string;
      parentBranchJoshi: string;
    };
  };
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
  branchUnitIds: { [unitId: string]: string[] };
  sentenceArray: string[];
  isMainSentence: boolean;
  invisibleUnitIds: string[];
  superSentenceTexts?: { [sentenceId: string]: string };
  isMainSentenceArray: boolean;
  superSentenceBodyTexts?: { [sentenceId: string]: string[] };
  setBodyTexts: React.Dispatch<React.SetStateAction<string[]>>;
  superSetSentenceTexts?: React.Dispatch<
    React.SetStateAction<{ [sentenceId: string]: string }>
  >;
  superSetSentenceBodyTexts?: React.Dispatch<
    React.SetStateAction<{ [sentenceId: string]: string[] }>
  >;
}): void {
  const sentence = sentences[sentenceId];
  const parentUnitIds: { [unitId: string]: string } = {};
  for (const unit of Object.values(units)) {
    parentUnitIds[unit.id] = unit.parentUnitId;
  }
  const bodyTexts = getBodyTexts({
    units,
    sentence,
    parentUnitIds,
    branchUnitIds,
    isMainSentence,
    invisibleUnitIds,
    isMainSentenceArray,
  });
  // 内部
  setBodyTexts(bodyTexts);

  // 外部
  if (!!superSentenceBodyTexts && !!superSetSentenceBodyTexts) {
    const newSuperSentenceBodyTexts: { [sentenceId: string]: string[] } =
      JSON.parse(JSON.stringify(superSentenceBodyTexts));
    newSuperSentenceBodyTexts[sentenceId] = bodyTexts;
    superSetSentenceBodyTexts(newSuperSentenceBodyTexts);
  }

  if (!!superSentenceTexts && !!superSetSentenceTexts) {
    const text = sentenceArray
      .map((sentenceId) => sentences[sentenceId])
      .map(
        (sentence) =>
          sentence.buntouText +
          (sentence.id === sentenceId
            ? bodyTexts
            : !!superSentenceBodyTexts
            ? superSentenceBodyTexts[sentenceId]
            : []
          ).join('') +
          sentence.bunmatsuText
      )
      .join('');

    const newSuperSentenceTexts: { [sentenceId: string]: string } = JSON.parse(
      JSON.stringify(superSentenceTexts)
    );
    newSuperSentenceTexts[sentenceId] = text;
    superSetSentenceTexts(newSuperSentenceTexts);
  }
}
