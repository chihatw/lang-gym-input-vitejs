import { useContext, useEffect, useState } from 'react';
import { Word } from '../entities/Word';
import { Branch } from '../entities/Branch';
import { INITIAL_SENTENCE, Sentence } from '../entities/Sentence';
import { getUniqueStr } from './getUniqueStr';
import { ComplexSentenceInputContext } from './context';
import { getSortedUnitIDs, getUnitText, Unit } from '../entities/Unit';

export const useSentenceArrayInput = (sentenceArray: string[]) => {
  const {
    globalUnits,
    globalWords,
    globalBranches,
    globalSentences,
    activeSentenceID,
    setGlobalSentences,
    setActiveSentenceID,
    globalSentenceArrays,
    setGlobalSentenceArrays,
  } = useContext(ComplexSentenceInputContext);
  const [hasAddSentnceButton, setHasAddSentnceButton] = useState(false);
  const [hasAddSubSentnceButton, setHasAddSubSentnceButton] = useState(false);

  useEffect(() => {
    const mainSentenceArray = globalSentenceArrays[0];
    if (!mainSentenceArray) return;
    // addSentnceButton「文追加」　はメインにだけ表示する
    if (sentenceArray[0] === mainSentenceArray[0]) {
      const sentenceID = mainSentenceArray.slice(-1)[0];
      const sentence = globalSentences[sentenceID];
      if (!!sentence) {
        setHasAddSentnceButton(
          hasSentenceTexts({
            units: globalUnits,
            words: globalWords,
            branches: globalBranches,
            sentence,
          })
        );
      } else {
        setHasAddSentnceButton(false);
      }
    }
  }, [
    globalUnits,
    globalWords,
    sentenceArray,
    globalBranches,
    globalSentences,
    globalSentenceArrays,
  ]);

  useEffect(() => {
    const sentenceID = sentenceArray.slice(-1)[0];
    const sentence = globalSentences[sentenceID];
    if (!!sentence) {
      setHasAddSubSentnceButton(
        hasSentenceTexts({
          units: globalUnits,
          words: globalWords,
          branches: globalBranches,
          sentence,
        })
      );
    } else {
      setHasAddSubSentnceButton(false);
    }
  }, [
    globalUnits,
    globalWords,
    sentenceArray,
    globalBranches,
    globalSentences,
  ]);

  const onAddSentence = () => {
    const newSentence: Sentence = { ...INITIAL_SENTENCE, id: getUniqueStr() };
    const updatedSentences = {
      ...globalSentences,
      [newSentence.id]: newSentence,
    };
    setGlobalSentences(updatedSentences);
    const newSentenceArrays = globalSentenceArrays.map((globalSentenceArray) =>
      globalSentenceArray[0] === sentenceArray[0]
        ? globalSentenceArray.concat([newSentence.id])
        : globalSentenceArray
    );
    setGlobalSentenceArrays(newSentenceArrays);
  };

  const onAddSubSentence = () => {
    const newSentence: Sentence = { ...INITIAL_SENTENCE, id: getUniqueStr() };
    const updatedSentences = {
      ...globalSentences,
      [newSentence.id]: newSentence,
    };
    setGlobalSentences(updatedSentences);
    const newGlobalSentenceArrays = [...globalSentenceArrays];
    newGlobalSentenceArrays.push([newSentence.id]);
    setGlobalSentenceArrays(newGlobalSentenceArrays);
  };

  return {
    onAddSentence,
    activeSentenceID,
    onAddSubSentence,
    hasAddSentnceButton,
    hasAddSubSentnceButton,
    setActiveSentenceID,
  };
};

const hasSentenceTexts = ({
  units,
  words,
  branches,
  sentence,
}: {
  units: { [id: string]: Unit };
  words: { [id: string]: Word };
  branches: { [id: string]: Branch };
  sentence: Sentence;
}) => {
  let result = false;
  sentence.buntouSeibuns.forEach((wordID) => {
    !!words[wordID].text && (result = true);
  });
  const sentenceTexts = getSentenceTexts({
    units,
    words,
    branches,
    sentence,
  });

  !!sentenceTexts.join('') && (result = true);
  return result;
};

const getSentenceTexts = ({
  units,
  words,
  sentence,
  branches,
}: {
  words: { [id: string]: Word };
  units: { [id: string]: Unit };
  branches: { [id: string]: Branch };
  sentence: Sentence;
}) => {
  let topicTexts: string[] = [];

  if (!!sentence.topic) {
    const sortedUnitIDs = getSortedUnitIDs({
      units,
      unitID: sentence.topic,
      branches,
    });
    topicTexts = sortedUnitIDs.map((unitID) =>
      getUnitText({ units, branches, words, unitID })
    );
  }

  let commentTexts: string[][] = [];
  sentence.comments.forEach((unitID, index) => {
    const sortedUnitIDs = getSortedUnitIDs({
      units,
      unitID,
      branches,
    });
    const unitText: string[] = sortedUnitIDs.map((unitID) =>
      getUnitText({ units, branches, words, unitID })
    );
    commentTexts.push(unitText);
  });

  let sentenceTexts: string[] = [];

  !!topicTexts.length && (sentenceTexts = topicTexts);
  commentTexts.forEach((commentUnitText) => {
    !!commentUnitText.length &&
      (sentenceTexts = sentenceTexts.concat(commentUnitText));
  });

  return sentenceTexts;
};
