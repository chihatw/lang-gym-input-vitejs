import hinshiTexts from 'hinshi-texts';
import { useContext, useEffect, useState } from 'react';

import { Branch } from '../entities/Branch';
import { Sentence } from '../entities/Sentence';
import {
  Unit,
  getUnitText,
  getSortedUnitIDs,
  isTopicBranchUnit,
  isCommentRenyouBranchUnit,
} from '../entities/Unit';
import { Word } from '../entities/Word';
import { SentenceInputContext } from '../sentence-input';

export const useWordInput = (wordID: string, unitID: string) => {
  const {
    sentenceID,
    globalUnits,
    globalWords,
    globalBranches,
    onChangeHinshi,
    globalSentences,
    onChangeSentence,
    onSetActiveSentence,
  } = useContext(SentenceInputContext);
  const [text, setText] = useState('');
  const [hinshi, setHinshi] = useState('meishi');
  const [hinshis, setHinshis] = useState<string[]>([]);

  useEffect(() => {
    let text = '';
    const word: Word | null = globalWords[wordID];
    if (!!word) {
      text = word.text;
    }
    setText(text);
  }, [globalWords, wordID]);

  useEffect(() => {
    let hinshi = 'meishi';
    const word: Word | null = globalWords[wordID];
    if (!!word) {
      hinshi = word.hinshi;
    }
    setHinshi(hinshi);
  }, [globalWords, wordID]);

  useEffect(() => {
    let hinshis: string[] = [];
    const sentence: Sentence | null = globalSentences[sentenceID];
    if (!!sentence) {
      hinshis = getHinshis({
        units: globalUnits,
        words: globalWords,
        branches: globalBranches,
        unitID,
        sentence,
      });
    }
    setHinshis(hinshis);
  }, [
    unitID,
    sentenceID,
    globalWords,
    globalUnits,
    globalBranches,
    globalSentences,
  ]);

  useEffect(() => {
    const word: Word | null = globalWords[wordID];
    if (!word) return;
    setHinshi(word.hinshi);
  }, [globalWords, wordID]);

  // テキストフィールドの幅を文字に合わせる
  useEffect(() => {
    const word: Word | null = globalWords[wordID];
    if (!word) return;
    const span = document.getElementById(`textMetrics_${word.id}`);
    const input = document.getElementById(`txt_${word.id}`);
    if (span && input) {
      span.textContent = text;
      input.style.width = `${Math.max(span.clientWidth + 8, 20)}px`;
    }
  }, [text, globalWords, wordID]);

  const onChangeText = (text: string) => {
    // テキスト空欄を許可
    const newWords = { ...globalWords };
    const newUnits = { ...globalUnits };
    if (!text) {
      const sortedUnitIDs = getSortedUnitIDs({
        units: globalUnits,
        branches: globalBranches,
        unitID,
      });
      const unitText = sortedUnitIDs.map((unitID) =>
        getUnitText({
          units: globalUnits,
          branches: globalBranches,
          words: globalWords,
          unitID,
        })
      );
      const unit: Unit | null = globalUnits[unitID];
      if (!unit) return;
      if (
        !unit.branchIDs.length ||
        window.confirm(`「${unitText}」を削除してもいいですか`)
      ) {
        newUnits[unit.id] = {
          ...unit,
          branchIDs: [],
        };
      }
    }

    setText(text);
    text = text.replace(/\s+/g, '');
    const word: Word | null = globalWords[wordID];
    if (!word) return;
    newWords[wordID] = { ...word, text };
    onChangeSentence({
      newUnits,
      newWords,
    });
  };
  const onFocus = () => {
    const word: Word | null = globalWords[wordID];
    if (!word) return;
    onSetActiveSentence();
  };
  return {
    text,
    hinshi,
    hinshis,
    onFocus,
    onChangeText,
    onChangeHinshi,
  };
};

const getHinshis = ({
  units,
  words,
  unitID,
  branches,
  sentence,
}: {
  units: { [id: string]: Unit };
  words: { [id: string]: Word };
  unitID: string;
  branches: { [id: string]: Branch };
  sentence: Sentence;
}): string[] => {
  const parentBranch: Branch | null = Object.values(branches).filter(
    (branch) => branch.unitID === unitID
  )[0];
  const parentUnit = !!parentBranch
    ? Object.keys(units)
        .map((unitID) => units[unitID])
        .filter((unit) => unit.branchIDs.includes(parentBranch?.id))[0]
    : '';
  const commentWord = !!parentUnit ? words[parentUnit.wordID] : null;

  // 説明ユニット
  if (sentence.comments.includes(unitID)) {
    return ['meishibunmatsu', 'doushi', 'ikeiyoushi', 'nakeiyoushi'];
  }
  // 主題のブランチユニット
  else if (isTopicBranchUnit(sentence, units, branches, unitID)) {
    return ['meishi', 'jisuushi', 'doushi', 'sentence'];
  }
  // 説明の連用ブランチユニット
  else if (isCommentRenyouBranchUnit(sentence, units, branches, unitID)) {
    // 名詞文末がある場合
    if (!!commentWord && ['meishi', 'jisuushi'].includes(commentWord.hinshi)) {
      return ['meishi', 'jisuushi', 'hukushi'];
    } else {
      return Object.keys(hinshiTexts).filter(
        (hinshi) =>
          !['meishibunmatsu', 'setsuzokushi', 'rentaishi', 'other'].includes(
            hinshi
          )
      );
    }
  } else {
    return Object.keys(hinshiTexts).filter(
      (hinshi) => !['meishibunmatsu', 'setsuzokushi', 'other'].includes(hinshi)
    );
  }
};
