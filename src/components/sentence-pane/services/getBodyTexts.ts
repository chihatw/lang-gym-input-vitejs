import getSortedUnitIds from 'get-sorted-unit-id';

export const getBodyTexts = ({
  units,
  sentence,
  branchUnitIds,
  isMainSentence,
  invisibleUnitIds,
  isMainSentenceArray,
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
  sentence: {
    id: string;
    topicUnitId: string;
    hasBunmatsu: boolean;
    isTaigendome: boolean;
    commentUnitIds: string[];
    topicBranchUnitId: string;
  };
  branchUnitIds: { [unitId: string]: string[] };
  parentUnitIds: { [unitId: string]: string };
  isMainSentence: boolean;
  invisibleUnitIds: string[];
  isMainSentenceArray: boolean;
}) => {
  let topicTexts: string[] = [];
  const parentUnitIds: { [unitId: string]: string } = {};
  for (const unit of Object.values(units)) {
    parentUnitIds[unit.id] = unit.parentUnitId;
  }

  if (
    !!sentence.topicBranchUnitId &&
    !invisibleUnitIds.includes(sentence.topicBranchUnitId)
  ) {
    const sortedUnitIds = getSortedUnitIds({
      parentUnitIds,
      unitId: sentence.topicUnitId,
      branchUnitIds,
      invisibleUnitIds,
    });
    topicTexts = sortedUnitIds
      .map((unitId) => units[unitId])
      .map((unit) => unit.text + unit.parentBranchJoshi);
  }

  const commentTexts: string[][] = [];

  const commentUnitIds = sentence.commentUnitIds.filter(
    (unitId) => !invisibleUnitIds.includes(unitId)
  );

  commentUnitIds.forEach((unitId, index) => {
    const sortedUnitIds = getSortedUnitIds({
      unitId,
      parentUnitIds,
      branchUnitIds,
      invisibleUnitIds,
    });

    let unitTexts: string[] = sortedUnitIds
      .map((unitId) => units[unitId])
      .map((unit) => unit.text + unit.parentBranchJoshi + unit.setsuzokuJoshi);

    // 最後のコメントの句読点処理
    if (index + 1 === commentUnitIds.length) {
      // 終助詞、準体助詞、準体助詞文末がなく、かつ体言止めではない場合、句読点を付ける
      if (!sentence.hasBunmatsu && !sentence.isTaigendome) {
        // メインだけ句読点をつける
        if (isMainSentenceArray) {
          // 最終は「。」それ以外は「、」
          if (isMainSentence) {
            const last = unitTexts.pop();
            unitTexts = unitTexts.concat([last + '。']);
          } else {
            const last = unitTexts.pop();
            unitTexts = unitTexts.concat([last + '、']);
          }
        }
      }
    }
    // 最後以外のコメントに読点を追加
    else {
      const last = unitTexts.pop();
      unitTexts = unitTexts.concat([last + '、']);
    }
    commentTexts.push(unitTexts);
  });

  let bodyTexts: string[] = !!topicTexts.length ? topicTexts : [];
  commentTexts
    .filter((unitTexts) => !!unitTexts.length)
    .forEach((commentUnitText) => {
      bodyTexts = bodyTexts.concat(commentUnitText);
    });
  return bodyTexts;
};
