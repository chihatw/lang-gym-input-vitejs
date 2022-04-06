import { Navigate, useNavigate } from 'react-router-dom';
import React, { useContext } from 'react';

import { Sentence } from '../../../entities/Sentence';
import { AppContext } from '../../../services/app';
import ArticlePageComponent from './components/ArticlePageComponent';
import { useHandleQuestions } from '../../../services/useQuestions';
import { useHandleQuestionSets } from '../../../services/useQuestionSets';
import {
  QuestionGroup,
  useHandleQuestionGroups,
} from '../../../services/useQuestionGroups';

const ArticlePage = () => {
  const navigate = useNavigate();

  const { createAccentsQuestions, createRhythmQuestions } =
    useHandleQuestions();
  const { createInitialQuestionGroup, updateQuestionGroup } =
    useHandleQuestionGroups();
  const { createAccentsQuestionSet, createRhythmQuestionSet } =
    useHandleQuestionSets();

  const { article, isFetching, sentences } = useContext(AppContext);

  // TODO add sentenceParseNews (SentenceParseListPage)

  const createAccentsQuestion = async () => {
    const questionGroup = await createInitialQuestionGroup();

    if (!!questionGroup) {
      const docIds = await createAccentsQuestions({
        sentences,
        questionGroupId: questionGroup.id,
      });
      if (!!docIds.length) {
        const updatedQuestionGroup: QuestionGroup = {
          ...questionGroup,
          questions: docIds,
        };
        const { success } = await updateQuestionGroup(updatedQuestionGroup);
        if (success) {
          const questionSetID = await createAccentsQuestionSet({
            title: article.title,
            questionGroupId: questionGroup.id,
            sentences,
          });
          if (!!questionSetID) {
            navigate(`/accentsQuestion/${questionSetID}`);
          }
        }
      }
    }
  };

  const createRhythmsQuestion = async () => {
    const questionGroup = await createInitialQuestionGroup();
    if (!!questionGroup) {
      const docIds = await createRhythmQuestions({
        sentences,
        downloadURL: article.downloadURL,
        questinGroupId: questionGroup.id,
      });
      if (!!docIds.length) {
        const updatedQuestionGroup: QuestionGroup = {
          ...questionGroup,
          questions: docIds,
        };
        const { success } = await updateQuestionGroup(updatedQuestionGroup);
        if (success) {
          const questionSetId = await createRhythmQuestionSet({
            title: article.title,
            questionGroupId: questionGroup.id,
            accentsArray: sentences.map((sentence) => sentence.accents),
          });
          if (!!questionSetId) {
            navigate(`/rhythmsQuestion/${questionSetId}`);
          }
        }
      }
    }
  };

  const openPage = ({
    path,
    sentence,
  }: {
    path: string;
    sentence: Sentence;
  }) => {
    // TODO useSentences作成時に sentenceId の設定
    navigate(`/sentence/${path}`);
  };

  // データ取得中
  if (isFetching) {
    return <></>;
  } else {
    if (!!article.id) {
      return (
        <ArticlePageComponent
          article={article}
          openPage={openPage}
          sentences={sentences}
          createAccentsQuestion={createAccentsQuestion}
          createRhythmsQuestion={createRhythmsQuestion}
        />
      );
    }
    // article が 初期値
    else {
      return <Navigate to={'/article/list'} />;
    }
  }
};

export default ArticlePage;
