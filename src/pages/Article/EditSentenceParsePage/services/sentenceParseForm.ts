import { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { AppContext } from '../../../../services/app';
import { getUniqueStr } from '../../../../services/getUniqueStr';
import { Article } from '../../../../services/useArticles';
import {
  SentenceParseNew,
  Branch,
  Unit,
  Word,
  INITIAL_SENTENCE,
  Sentence as PSentence,
  useHandleSentenceParseNews,
} from '../../../../services/useSentenceParseNews';
import { Sentence } from '../../../../services/useSentences';

export const useSentenceParseForm = (article: Article, sentence: Sentence) => {
  const navigate = useNavigate();

  const { sentenceParseNew } = useContext(AppContext);

  const { createSentenceParseNew, updateSentenceParseNew } =
    useHandleSentenceParseNews();

  const sentenceID = getUniqueStr();

  const [globalSentences, setGlobalSentences] = useState<{
    [id: string]: PSentence;
  }>({ [sentenceID]: { ...INITIAL_SENTENCE, id: sentenceID } });
  const [globalUnits, setGlobalUnits] = useState<{ [id: string]: Unit }>({});
  const [globalBranches, setGlobalBranches] = useState<{
    [id: string]: Branch;
  }>({});
  const [globalWords, setGlobalWords] = useState<{ [id: string]: Word }>({});
  const [globalSentenceArrays, setGlobalSentenceArrays] = useState<string[][]>([
    [sentenceID],
  ]);
  const [activeSentenceID, setActiveSentenceID] = useState(sentenceID);
  const [globalBranchInvisibilities, setGlobalBranchInvisibilities] = useState<
    string[]
  >([]);
  const [globalCommentInvisibilities, setGlobalCommentInvisibilities] =
    useState<string[]>([]);

  useEffect(() => {
    setGlobalUnits(sentenceParseNew.units);
    setGlobalWords(sentenceParseNew.words);
    setGlobalBranches(sentenceParseNew.branches);
    setGlobalSentences(sentenceParseNew.sentences);
    setGlobalSentenceArrays(sentenceParseNew.sentenceArrays);
    setGlobalBranchInvisibilities(sentenceParseNew.branchInvisibilities);
    setGlobalCommentInvisibilities(sentenceParseNew.commentInvisibilities);
  }, [sentenceParseNew]);

  const onSubmit = async () => {
    if (!!sentenceParseNew) {
      const _updateSentenceParse: SentenceParseNew = {
        ...sentenceParseNew,
        units: globalUnits,
        words: globalWords,
        branches: globalBranches,
        sentences: globalSentences,
        sentenceArrays: globalSentenceArrays,
        branchInvisibilities: globalBranchInvisibilities,
        commentInvisibilities: globalCommentInvisibilities,
      };
      const updatedItem = await updateSentenceParseNew(_updateSentenceParse);
      if (!!updatedItem) {
        navigate(`/article/${article.id}`);
      }
    } else {
      const newSentenceParse: Omit<SentenceParseNew, 'id'> = {
        line: sentence.line,
        article: article.id,
        sentence: sentence.id,
        units: globalUnits,
        words: globalWords,
        branches: globalBranches,
        sentences: globalSentences,
        sentenceArrays: globalSentenceArrays,
        branchInvisibilities: globalBranchInvisibilities,
        commentInvisibilities: globalCommentInvisibilities,
      };
      const createdItem = await createSentenceParseNew(newSentenceParse);
      if (!!createdItem) {
        navigate(`/article/${article.id}`);
      }
    }
  };
  return {
    sentenceParseNew,
    onSubmit,
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
    globalBranchInvisibilities,
    globalCommentInvisibilities,
    setGlobalBranchInvisibilities,
    setGlobalCommentInvisibilities,
  };
};
