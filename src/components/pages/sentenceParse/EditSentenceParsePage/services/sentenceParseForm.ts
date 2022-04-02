import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { Sentence } from '../../../../../entities/Sentence';

import {
  Branch,
  Unit,
  Word,
  INITIAL_SENTENCE,
  Sentence as PSentence,
  SentenceParseNew,
  CreateSentenceParseNew,
} from '../../../../../entities/SentenceParseNew';
import {
  createSentenceParseNew,
  getSentenceParseNew,
  updateSentenceParseNew,
} from '../../../../../repositories/sentenceParseNew';
import { getUniqueStr } from '../../../../../services/getUniqueStr';
import { Article } from '../../../../../services/useArticles';

export const useSentenceParseForm = (article: Article, sentence: Sentence) => {
  const navigate = useNavigate();
  const sentenceID = getUniqueStr();
  const [sentenceParseNew, setSentenceParseNew] =
    useState<SentenceParseNew | null>(null);
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
    const fetchData = async () => {
      const sentenceParseNew: SentenceParseNew | null =
        await getSentenceParseNew(article.id, sentence.id);
      if (!!sentenceParseNew) {
        setSentenceParseNew(sentenceParseNew);
        setGlobalUnits(sentenceParseNew.units);
        setGlobalWords(sentenceParseNew.words);
        setGlobalBranches(sentenceParseNew.branches);
        setGlobalSentences(sentenceParseNew.sentences);
        setGlobalSentenceArrays(sentenceParseNew.sentenceArrays);
        setGlobalBranchInvisibilities(sentenceParseNew.branchInvisibilities);
        setGlobalCommentInvisibilities(sentenceParseNew.commentInvisibilities);
      }
    };
    fetchData();
  }, [article, sentence]);

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
      const { success } = await updateSentenceParseNew(_updateSentenceParse);
      if (success) {
        navigate(`/article/${article.id}/parse`);
      }
    } else {
      const newSentenceParse: CreateSentenceParseNew = {
        line: sentence.line,
        article: article.id,
        sentence: sentence.id,
        units: JSON.stringify(globalUnits),
        words: JSON.stringify(globalWords),
        branches: JSON.stringify(globalBranches),
        sentences: JSON.stringify(globalSentences),
        sentenceArrays: JSON.stringify(globalSentenceArrays),
        branchInvisibilities: JSON.stringify(globalBranchInvisibilities),
        commentInvisibilities: JSON.stringify(globalCommentInvisibilities),
      };
      const { success } = await createSentenceParseNew(newSentenceParse);
      if (success) {
        navigate(`/article/${article.id}/parse`);
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
