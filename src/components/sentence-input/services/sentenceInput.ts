import { useEffect, useState } from 'react';
import { DropResult } from 'react-beautiful-dnd';
import {
  Branch,
  RentaiJoshi,
  RenyouJoshi,
  getJoshiText,
  isRentaiBranch,
} from '../entities/Branch';
import kakuJoshiTexts from 'kakujoshi-texts';
import kakariJoshiTexts from 'kakarijoshi-texts';
import { INITIAL_SENTENCE, Sentence } from '../entities/Sentence';
import {
  getUnitHinshi,
  INITIAL_UNIT,
  Unit,
  getSortedUnitIDs,
  getUnitText,
} from '../entities/Unit';
import { INITIAL_WORD, Word } from '../entities/Word';
import { checkSubElements } from './checkSubElements';
import { getUniqueStr } from './getUniqueStr';

export const useSentenceInput = ({
  sentenceID,
  globalUnits,
  globalWords,
  globalBranches,
  globalSentences,
  activeSentenceID,
  globalSentenceArrays,
  setGlobalUnits,
  setGlobalWords,
  setGlobalBranches,
  setGlobalSentences,
  setActiveSentenceID,
  setGlobalSentenceArrays,
}: {
  sentenceID: string;
  globalUnits: { [id: string]: Unit };
  globalWords: { [id: string]: Word };
  globalBranches: { [id: string]: Branch };
  globalSentences: { [id: string]: Sentence };
  activeSentenceID?: string;
  globalSentenceArrays: string[][];

  setGlobalUnits: (value: { [id: string]: Unit }) => void;
  setGlobalWords: (value: { [id: string]: Word }) => void;
  setGlobalBranches: (value: { [id: string]: Branch }) => void;
  setGlobalSentences: (value: { [id: string]: Sentence }) => void;
  setActiveSentenceID?: (value: string) => void;
  setGlobalSentenceArrays: (value: string[][]) => void;
}) => {
  const [isLastSentence, setIsLastSentence] = useState(true);
  const [isFirstSentence, setIsFirstSentence] = useState(true);
  const [isActiveSentence, setIsActiveSentence] = useState(false);
  const [hasJuntaiJoshiBunmatsu, setHasJuntaiJoshiBunmatsu] = useState(false);

  useEffect(() => {
    const sentence: Sentence | null = globalSentences[sentenceID];
    if (!sentence) return;
    setHasJuntaiJoshiBunmatsu(!!sentence.juntaiJoshiBunmatsu);
  }, [globalSentences, sentenceID]);

  useEffect(() => {
    if (!globalSentenceArrays) {
      // 単文の場合
      setIsActiveSentence(true);
    } else {
      // 複文の場合
      if (!!activeSentenceID) {
        // activeSentenceIDが設定済の場合
        setIsActiveSentence(sentenceID === activeSentenceID);
      } else {
        // activeSentenceIDが未設定の場合
        if (!!setActiveSentenceID) {
          const newActiveSentenceID = globalSentenceArrays[0][0];
          setActiveSentenceID(newActiveSentenceID);
          setIsActiveSentence(sentenceID === newActiveSentenceID);
        }
      }
    }
  }, [sentenceID, activeSentenceID, globalSentenceArrays, setActiveSentenceID]);

  const onSetActiveSentence = () => {
    const sentence: Sentence | null = globalSentences[sentenceID];
    if (!sentence) return;
    !!setActiveSentenceID && setActiveSentenceID(sentence.id);
    setIsActiveSentence(true);
  };

  // 複文の最終行かどうかを判断
  useEffect(() => {
    const sentence: Sentence | null = globalSentences[sentenceID];
    if (!sentence) return;
    if (!globalSentenceArrays) return;
    const sentenceArray = globalSentenceArrays.filter((sentenceArray) =>
      sentenceArray.includes(sentence.id)
    )[0];
    setIsFirstSentence(sentenceArray[0] === sentence.id);
    setIsLastSentence(sentenceArray.slice(-1)[0] === sentence.id);
  }, [globalSentenceArrays, globalSentences, sentenceID]);

  const onAddBuntouSeibun = () => {
    const sentence: Sentence | null = globalSentences[sentenceID];
    if (!sentence) return;
    const newSentence = { ...sentence };
    const newWords = { ...globalWords };
    const wordID = getUniqueStr();

    // 先頭要素がまだない場合は文頭
    const isBuntou = isFirstSentence && !sentence.buntouSeibuns.length;

    const newWord: Word = {
      ...INITIAL_WORD,
      id: wordID,
      hinshi: isBuntou ? 'setsuzokushi' : 'hukushi',
    };
    newWords[wordID] = newWord;
    newSentence.buntouSeibuns = newSentence.buntouSeibuns.concat(wordID);

    onChangeSentence({
      newSentence,
      newWords,
    });

    focusTextField(`txt_${wordID}`);
  };
  const onRemoveBuntouSeibuns = () => {
    const sentence: Sentence | null = globalSentences[sentenceID];
    if (!sentence) return;
    const newSentence = { ...sentence };
    newSentence.buntouSeibuns = [];
    onChangeSentence({ newSentence });
  };
  const onAddTopic = () => {
    const sentence: Sentence | null = globalSentences[sentenceID];
    if (!sentence) return;
    const newSentence = { ...sentence };
    const newUnits = { ...globalUnits };
    const newBranches = { ...globalBranches };
    const newWords = { ...globalWords };

    const wordID = getUniqueStr();
    const word: Word = {
      ...INITIAL_WORD,
      id: wordID,
      hinshi: 'meishi',
    };
    newWords[wordID] = word;

    const branchUnitID = getUniqueStr();
    const branchUnit: Unit = {
      ...INITIAL_UNIT,
      id: branchUnitID,
      wordID,
    };
    newUnits[branchUnitID] = branchUnit;

    const branchID = getUniqueStr();
    const branch: Branch = {
      id: branchID,
      unitID: branchUnitID,
      joshi: { kakuJoshi: '', kakariJoshi: 'ha' },
    };
    newBranches[branchID] = branch;

    const topicUnitID = getUniqueStr();
    const topicUnit: Unit = {
      ...INITIAL_UNIT,
      id: topicUnitID,
      branchIDs: [branchID],
    };
    newUnits[topicUnitID] = topicUnit;

    newSentence.topic = topicUnitID;
    onChangeSentence({
      newSentence,
      newUnits,
      newBranches,
      newWords,
    });
    focusTextField(`txt_${wordID}`);
  };
  const onRemoveTopic = () => {
    const sentence: Sentence | null = globalSentences[sentenceID];
    if (!sentence) return;
    const newSentence = { ...sentence };
    newSentence.topic = '';
    onChangeSentence({ newSentence });
  };

  const onAddDoushiComment = () => {
    const sentence: Sentence | null = globalSentences[sentenceID];
    if (!sentence) return;

    const newSentence = { ...sentence };
    const newUnits = { ...globalUnits };
    const newWords = { ...globalWords };
    const commentUnitID = getUniqueStr();
    const wordID = getUniqueStr();
    const word: Word = {
      ...INITIAL_WORD,
      id: wordID,
      hinshi: 'doushi',
    };
    newWords[wordID] = word;
    const commentUnit: Unit = {
      ...INITIAL_UNIT,
      id: commentUnitID,
      wordID,
    };
    newUnits[commentUnitID] = commentUnit;
    newSentence.comments = sentence.comments.concat([commentUnitID]);
    onChangeSentence({
      newSentence,
      newUnits,
      newWords,
    });

    focusTextField(`txt_${wordID}`);
  };

  const onAddComment = () => {
    const sentence: Sentence | null = globalSentences[sentenceID];
    if (!sentence) return;
    const newSentence = { ...sentence };
    const newUnits = { ...globalUnits };
    const newBranches = { ...globalBranches };
    const newWords = { ...globalWords };
    const commentUnitID = getUniqueStr();
    const wordID = getUniqueStr();
    // トピックがない時は動詞コメントを追加
    if (!sentence.topic) {
      const word: Word = {
        ...INITIAL_WORD,
        id: wordID,
        hinshi: 'doushi',
      };
      newWords[wordID] = word;
      const commentUnit: Unit = {
        ...INITIAL_UNIT,
        id: commentUnitID,
        wordID,
      };
      newUnits[commentUnitID] = commentUnit;
    }
    // トピックがある時は名詞コメントを追加
    else {
      const meishibunmatsu: Word = {
        ...INITIAL_WORD,
        id: wordID,
        text: 'です',
        hinshi: 'meishibunmatsu',
      };
      newWords[meishibunmatsu.id] = meishibunmatsu;
      const meishi: Word = {
        ...INITIAL_WORD,
        id: getUniqueStr(),
        hinshi: 'meishi',
      };
      newWords[meishi.id] = meishi;

      const commentUnitSubUnit: Unit = {
        ...INITIAL_UNIT,
        id: getUniqueStr(),
        wordID: meishi.id,
      };
      newUnits[commentUnitSubUnit.id] = commentUnitSubUnit;

      const commentUnitBranch: Branch = {
        id: getUniqueStr(),
        unitID: commentUnitSubUnit.id,
        joshi: { kakuJoshi: '', kakariJoshi: '' },
      };
      newBranches[commentUnitBranch.id] = commentUnitBranch;

      const commentUnit: Unit = {
        ...INITIAL_UNIT,
        id: commentUnitID,
        wordID: meishibunmatsu.id,
        branchIDs: [commentUnitBranch.id],
      };

      newUnits[commentUnitID] = commentUnit;
    }

    newSentence.comments = sentence.comments.concat([commentUnitID]);

    onChangeSentence({
      newSentence,
      newUnits,
      newBranches,
      newWords,
    });

    focusTextField(`txt_${wordID}`);
  };

  const onAddBranch = ({
    unitID,
    hinshi,
    kakuJoshi,
    kakariJoshi,
    hasRentaiJoshi,
    isAddRenyouBranch,
  }: {
    unitID: string;
    hinshi: string;
    kakuJoshi?: string;
    kakariJoshi?: string;
    hasRentaiJoshi?: boolean;
    isAddRenyouBranch?: boolean;
  }) => {
    const unit: Unit | null = globalUnits[unitID];
    if (!unit) return;
    const unitHinshi = getUnitHinshi(unit, globalWords);
    const isRentaiBranch =
      !isAddRenyouBranch && ['meishi', 'jisuushi'].includes(unitHinshi);
    const newWords = { ...globalWords };

    const word: Word = {
      ...INITIAL_WORD,
      id: getUniqueStr(),
      hinshi,
    };
    // 名詞文末のブランチの時、
    if (unitHinshi === 'meishibunmatsu') {
      if (!unit.branchIDs.length) {
        // 一つ目のブランチの時は、名詞に
        word.hinshi = 'meishi';
      } else {
        // 二つ目以降は副詞にする
        word.hinshi = 'hukushi';
      }
    }

    newWords[word.id] = word;

    const newUnits = { ...globalUnits };

    const subUnit: Unit = {
      ...INITIAL_UNIT,
      id: getUniqueStr(),
      wordID: word.id,
    };
    newUnits[subUnit.id] = subUnit;

    const newBranches = { ...globalBranches };

    const branch: Branch = {
      id: getUniqueStr(),
      unitID: subUnit.id,
      // 助詞の初期値は空の連用助詞
      joshi: { kakuJoshi: '', kakariJoshi: '' },
    };

    // 名詞文末のブランチ以外には助詞を設定する
    if (unitHinshi !== 'meishibunmatsu') {
      branch.joshi = isRentaiBranch
        ? { hasRentaiJoshi: hasRentaiJoshi || false }
        : { kakuJoshi: kakuJoshi || '', kakariJoshi: kakariJoshi || '' };
    }

    newBranches[branch.id] = branch;

    const newUnit = { ...unit };

    // 名詞文末のブランチは新しいブランチを上にする
    const newBranchIDs =
      unitHinshi === 'meishibunmatsu'
        ? [branch.id].concat(unit.branchIDs)
        : unit.branchIDs.concat([branch.id]);

    newUnit.branchIDs = newBranchIDs;

    newUnits[unitID] = newUnit;
    onChangeSentence({
      newUnits,
      newBranches,
      newWords,
    });
    focusTextField(`txt_${word.id}`);
  };

  const onAddMeishiRenyouBranch = ({
    unitID,
    kakuJoshi,
    kakariJoshi,
  }: {
    unitID: string;
    kakuJoshi: string;
    kakariJoshi: string;
  }) => {
    const sentence: Sentence | null = globalSentences[sentenceID];
    if (!sentence) return;
    const unit: Unit | null = globalUnits[unitID];
    if (!unit) return;
    const hinshi = getUnitHinshi(unit, globalWords);
    if (!globalWords[unit.wordID].text) {
      window.alert('テキストフィールドが空欄です');
      // 空欄を禁止する場合は、return で処理を終了させる
      // return
    }
    const isAddRenyouBranch = !['meishi', 'jisuushi'].includes(hinshi);
    const isComment = sentence.comments.includes(unitID);
    if (!isComment && !isAddRenyouBranch) {
      let text = '体言に「◯◯';
      !!kakuJoshi && (text += kakuJoshiTexts[kakuJoshi]);
      !!kakariJoshi && (text += kakariJoshiTexts[kakariJoshi]);
      text += '」は追加できません';
      window.alert(text);
      return;
    }
    onAddBranch({
      unitID: unit.id,
      hinshi: 'meishi',
      hasRentaiJoshi: true,
      isAddRenyouBranch: true,
      kakariJoshi,
      kakuJoshi,
    });
  };

  const onAddMeishiRentaiBranch = (unitID: string) => {
    const unit: Unit | null = globalUnits[unitID];
    if (!unit) return;
    const hinshi = getUnitHinshi(unit, globalWords);
    const word = globalWords[unit.wordID];
    if (!word) return;
    if (!word.text) {
      window.alert('テキストフィールドが空欄です');
      // 空欄を禁止する場合は、return で処理を終了させる
      // return;
    }
    const isAddRenyouBranch = !['meishi', 'jisuushi'].includes(hinshi);
    if (isAddRenyouBranch) {
      let text = '用言に「◯◯の」は追加できません';
      window.alert(text);
      return;
    }
    onAddBranch({
      unitID: unit.id,
      hinshi: 'meishi',
      hasRentaiJoshi: true,
      isAddRenyouBranch: false,
    });
  };

  const onAddDoushiBranch = (unitID: string) => {
    const unit: Unit | null = globalUnits[unitID];
    if (!unit) return;

    const hinshi = getUnitHinshi(unit, globalWords);
    const word: Word | null = globalWords[unit.wordID];
    if (!word) return;
    if (!word.text) {
      window.alert('テキストフィールドが空欄です');
      // 空欄を禁止する場合は、return で処理を終了させる
      // return;
    }
    const isAddRenyouBranch = !['meishi', 'jisuushi'].includes(hinshi);
    onAddBranch({
      unitID: unit.id,
      hinshi: 'doushi',
      hasRentaiJoshi: false,
      isAddRenyouBranch,
    });
  };

  const onRemoveBranch = (branchID: string) => {
    const sentence: Sentence | null = globalSentences[sentenceID];
    if (!sentence) return;
    let subUnitText = '';
    const branch: Branch | null = globalBranches[branchID];
    if (!branch) return;
    const subUnit: Unit | null = globalUnits[branch.unitID];
    const sortedUnitIDs = !!subUnit
      ? getSortedUnitIDs({
          units: globalUnits,
          branches: globalBranches,
          unitID: subUnit.id,
        })
      : [];
    subUnitText = sortedUnitIDs
      .map((unitID) =>
        getUnitText({
          units: globalUnits,
          branches: globalBranches,
          words: globalWords,
          unitID,
        })
      )
      .join('');

    if (!subUnitText || window.confirm(`「${subUnitText}」を削除しますか`)) {
      const newUnits = { ...globalUnits };
      const newBranches = { ...globalBranches };
      const newWords = { ...globalWords };
      delete newBranches[branchID];
      delete newUnits[subUnit.id];
      delete newWords[subUnit.wordID];

      const newSentence = { ...sentence };
      const parentUnit: Unit | null = Object.values(globalUnits).filter(
        (globalUnit) => globalUnit.branchIDs.includes(branchID)
      )[0];
      if (!parentUnit) return;
      // 該当ブランチの中に含まれる word,branch,unitを抽出
      const deleteWordIDs: string[] = [];
      const deleteBranchIDs: string[] = [];
      const deleteUnitIDs: string[] = [];

      checkSubElements({
        branchID,
        globalUnits,
        deleteUnitIDs,
        deleteWordIDs,
        globalBranches,
        deleteBranchIDs,
      });
      deleteWordIDs.forEach((wordID) => {
        delete newWords[wordID];
      });

      deleteBranchIDs.forEach((branchID) => {
        delete newBranches[branchID];
      });

      deleteUnitIDs.forEach((unitID) => {
        delete newUnits[unitID];
      });

      // 親ユニットからブランチIDを削除
      const updatedBranchIDs: string[] = parentUnit.branchIDs.filter(
        (id) => id !== branchID
      );
      if (parentUnit.wordID === '' && !updatedBranchIDs.length) {
        // unitsの削除
        delete newUnits[newSentence.topic];
        newSentence.topic = '';
      } else {
        const updatedUnit: Unit = {
          ...parentUnit,
          branchIDs: updatedBranchIDs,
        };
        newUnits[updatedUnit.id] = updatedUnit;
      }

      onChangeSentence({
        newSentence,
        newUnits,
        newBranches,
        newWords,
      });

      // フォーカスの移動
      const branchIDs = parentUnit.branchIDs;
      if (branchIDs.length > 1) {
        const index = branchIDs.indexOf(branchID);
        const focusedBranchID = branchIDs[index + 1] || branchIDs[index - 1];
        const focusedBranch = globalBranches[focusedBranchID];
        const focusedUnit = globalUnits[focusedBranch.unitID];
        focusTextField(`txt_${focusedUnit.wordID}`);
      } else {
        focusTextField(`txt_${parentUnit.wordID}`);
      }
    }
  };
  const onChangeHinshi = (unitID: string, wordID: string, hinshi: string) => {
    const unit: Unit | null = globalUnits[unitID];
    if (!unit) return;
    const word: Word | null = globalWords[wordID];
    if (!word) return;
    const newUnits = { ...globalUnits };
    const newWords = { ...globalWords };
    const newBranches = { ...globalBranches };

    // unitのbranchesが空ではない場合、品詞変更前に確認をする
    const wordsText = globalWords[unit.wordID].text;
    const parentBranch: Branch | null = Object.values(globalBranches).filter(
      (branch) => branch.unitID === unitID
    )[0];
    const parentBranchJoshi = !!parentBranch ? getJoshiText(parentBranch) : '';
    const sortedUnitIDs = getSortedUnitIDs({
      units: globalUnits,
      branches: globalBranches,
      unitID,
    });
    const unitText = sortedUnitIDs
      .map((unitID) =>
        getUnitText({
          units: globalUnits,
          branches: globalBranches,
          words: globalWords,
          unitID,
        })
      )
      .join('');
    const branchesText = unitText.slice(
      0,
      unitText.length - (wordsText.length + parentBranchJoshi.length)
    );

    if (
      unit.branchIDs.length > 0 &&
      !window.confirm(`「${branchesText}」を削除してもいいですか`)
    )
      return;

    newUnits[unitID] = {
      ...unit,
      branchIDs: [],
    };

    const newWord = {
      ...word,
      hinshi,
    };

    newWords[word.id] = newWord;

    // 連体助詞の変更
    toggleRentaiJoshi({
      branches: newBranches,
      unit,
      hinshi,
      sentence: globalSentences[sentenceID],
    });
    // const isComment = sentence.comments.includes(unitID);
    // コミットの名詞文末の処理
    // !!isComment &&
    //   toggleMeishiBunmatsu({
    //     units: newUnits,
    //     unit: newUnits[unitID],
    //     hinshi,
    //     words: newWords,
    //   });
    if (!!parentBranch) {
      resetRenyouJoshi({ branches: newBranches, branch: parentBranch, hinshi });
    }
    onChangeSentence({
      newUnits,
      newBranches,
      newWords,
    });
  };
  const onToggleJuntaiJoshi = () => {
    const sentence: Sentence | null = globalSentences[sentenceID];
    if (!sentence) return;
    const newSentence = { ...sentence };
    newSentence.juntaiJoshi = !!sentence.juntaiJoshi
      ? sentence.juntaiJoshi === 'no'
        ? 'n'
        : ''
      : 'no';
    if (!newSentence.juntaiJoshi) {
      newSentence.shuuJoshi = '';
      newSentence.juntaiJoshiBunmatsu = '';
      setHasJuntaiJoshiBunmatsu(!!newSentence.juntaiJoshi);
    }
    onChangeSentence({
      newSentence,
    });
  };
  const onAddShuuJoshi = () => {
    const sentence: Sentence | null = globalSentences[sentenceID];
    if (!sentence) return;
    const newSentence = { ...sentence };
    newSentence.shuuJoshi = 'ka';

    onChangeSentence({
      newSentence,
    });
  };
  const onRemoveShuuJoshi = () => {
    const sentence: Sentence | null = globalSentences[sentenceID];
    if (!sentence) return;
    const newSentence = { ...sentence };
    newSentence.shuuJoshi = '';
    onChangeSentence({ newSentence });
  };
  const onDeleteSentence = () => {
    const sentence: Sentence | null = globalSentences[sentenceID];
    if (!sentence) return;
    if (window.confirm('削除しますか')) {
      // globalSentenceArraysの処理

      // 該当複文の抽出
      const sentenceArray = globalSentenceArrays.filter((sentenceArray) =>
        sentenceArray.includes(sentence.id)
      )[0];

      // 該当複文がSentenceArraysの第一項目ではない場合は詳細文
      const isSubSentence = !globalSentenceArrays[0].includes(sentence.id);

      // 詳細文である場合、または削除予定の文が複文の先頭ではない場合
      if (isSubSentence || sentenceArray[0] !== sentence.id) {
        // 文を削除
        setGlobalSentenceArrays(
          globalSentenceArrays
            .map((sentenceArray) =>
              sentenceArray.filter((id) => id !== sentence.id)
            )
            .filter((sentenceArray) => !!sentenceArray.length)
        );

        const newSentences = { ...globalSentences };
        delete newSentences[sentence.id];
        setGlobalSentences(newSentences);
      } else {
        // subSentenceArraysを削除
        const sentenceArray = globalSentenceArrays[0];
        setGlobalSentenceArrays([sentenceArray]);
        const sentenceID = sentenceArray[0];
        setGlobalSentences({
          [sentenceID]: {
            ...INITIAL_SENTENCE,
            id: sentenceID,
          },
        });
      }

      const newUnits = { ...globalUnits };
      const newBranches = { ...globalBranches };
      const newWords = { ...globalWords };

      const deleteUnitIDs: string[] = [];
      const deleteBranchIDs: string[] = [];
      const deleteWordIDs: string[] = [];

      if (!!sentence.topic) {
        const topicUnit: Unit | null = globalUnits[sentence.topic];
        if (!!topicUnit) {
          deleteUnitIDs.push(topicUnit.id);
          deleteWordIDs.push(topicUnit.wordID);
          topicUnit.branchIDs.forEach((branchID) => {
            checkSubElements({
              branchID,
              deleteUnitIDs,
              deleteBranchIDs,
              deleteWordIDs,
              globalUnits,
              globalBranches,
            });
          });
        }
      }

      sentence.comments.forEach((unitID) => {
        const commentUnit: Unit | null = globalUnits[unitID];
        if (!!commentUnit) {
          deleteUnitIDs.push(commentUnit.id);
          deleteWordIDs.push(commentUnit.wordID);
          commentUnit.branchIDs.forEach((branchID) => {
            checkSubElements({
              branchID,
              deleteUnitIDs,
              deleteBranchIDs,
              deleteWordIDs,
              globalUnits,
              globalBranches,
            });
          });
        }
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

      onChangeSentence({
        newSentence: {
          ...INITIAL_SENTENCE,
          id: sentence.id,
        },
        newUnits,
        newWords,
        newBranches,
        doNotUpdateSentenceGlobalJSONs: true,
      });
    }
  };
  const onAddJuntaiJoshiBunmatsu = () => {
    setHasJuntaiJoshiBunmatsu(true);
    focusTextField(`juntaiJoshiBunmatsu_${sentenceID}`);
  };
  const onRemoveJuntaiJoshiBunmatsu = () => {
    const sentence: Sentence | null = globalSentences[sentenceID];
    if (!sentence) return;
    setHasJuntaiJoshiBunmatsu(false);

    const newSentence = { ...sentence };
    newSentence.juntaiJoshiBunmatsu = '';
    onChangeSentence({ newSentence });
  };

  const onDragEnd = (result: DropResult, unitID: string) => {
    const { destination, source, draggableId } = result;
    if (!destination) return;
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    )
      return;

    const newBranchIDs = [...globalUnits[unitID].branchIDs];

    newBranchIDs.splice(source.index, 1);
    newBranchIDs.splice(destination.index, 0, draggableId);

    const unit: Unit | null = globalUnits[unitID];
    if (!unit) return;
    const newUnit = { ...unit };

    newUnit.branchIDs = newBranchIDs;

    const newUnits = { ...globalUnits };
    newUnits[unitID] = newUnit;
    onChangeSentence({ newUnits });
  };

  const onChangeSentence = ({
    newUnits,
    newWords,
    newSentence,
    newBranches,
    doNotUpdateSentenceGlobalJSONs,
  }: {
    newWords?: { [id: string]: Word };
    newUnits?: { [id: string]: Unit };
    newBranches?: { [id: string]: Branch };
    newSentence?: Sentence;
    doNotUpdateSentenceGlobalJSONs?: boolean;
  }) => {
    onSetActiveSentence();
    !!newWords && setGlobalWords(newWords); // unitsよりも先に更新
    !!newBranches && setGlobalBranches(newBranches); // unitsよりも先に更新
    !!newUnits && setGlobalUnits(newUnits); // sengtenceよりも先に更新

    if (newSentence) {
      const newSentences = { ...globalSentences };
      newSentences[newSentence.id] = newSentence;
      setGlobalSentences(newSentences);
    }

    if (!!globalSentences && !doNotUpdateSentenceGlobalJSONs) {
      if (!!newSentence) {
        const newGlobalSentences = { ...globalSentences };
        newGlobalSentences[newSentence.id] = newSentence;
        setGlobalSentences(newGlobalSentences);
      }
    }
  };

  return {
    isLastSentence,
    isFirstSentence,
    isActiveSentence,
    hasJuntaiJoshiBunmatsu,
    onDragEnd,
    onAddTopic,
    onAddComment,
    onRemoveTopic,
    onAddShuuJoshi,
    onRemoveBranch,
    onChangeHinshi,
    onChangeSentence,
    onDeleteSentence,
    onAddDoushiBranch,
    onRemoveShuuJoshi,
    onAddBuntouSeibun,
    onAddDoushiComment,
    onSetActiveSentence,
    onToggleJuntaiJoshi,
    onRemoveBuntouSeibuns,
    onAddMeishiRenyouBranch,
    onAddMeishiRentaiBranch,
    onAddJuntaiJoshiBunmatsu,
    onRemoveJuntaiJoshiBunmatsu,
  };
};

const focusTextField = (id: string) => {
  setTimeout(() => {
    const textField = document.getElementById(id);
    !!textField && (textField as HTMLInputElement).focus();
  }, 0);
};

const toggleRentaiJoshi = ({
  branches,
  unit,
  hinshi,
  sentence,
}: {
  branches: { [id: string]: Branch };
  hinshi: string;
  unit: Unit;
  sentence: Sentence;
}) => {
  const parentBranch: Branch | null = Object.values(branches).filter(
    (branch) => branch.unitID === unit.id
  )[0];
  if (!parentBranch) return;

  if (isRentaiBranch(parentBranch)) {
    (parentBranch.joshi as RentaiJoshi).hasRentaiJoshi = [
      'meishi',
      'jisuushi',
      'hukushi',
    ].includes(hinshi);
    branches[parentBranch.id] = parentBranch;
  }
};

const resetRenyouJoshi = ({
  branches,
  branch,
  hinshi,
}: {
  branches: { [id: string]: Branch };
  branch: Branch;
  hinshi: string;
}) => {
  if (typeof (branch.joshi as RenyouJoshi).kakuJoshi !== 'undefined') {
    const kakuJoshi: string = (() => {
      switch (hinshi) {
        case 'meishi':
          return 'ga';
        case 'sentence':
          return 'to';
        default:
          return '';
      }
    })();
    const newBranch = {
      ...branch,
      joshi: {
        kakuJoshi,
        kakariJoshi: '',
      },
    };
    branches[newBranch.id] = newBranch;
  }
};
