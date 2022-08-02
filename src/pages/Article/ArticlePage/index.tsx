import { Navigate, useNavigate, useParams } from 'react-router-dom';
import React, { useContext, useEffect, useState } from 'react';

import ArticlePageComponent from './components/ArticlePageComponent';
import { useHandleQuestions } from '../../../services/useQuestions';
import {
  QuestionGroup,
  useHandleQuestionGroups,
} from '../../../services/useQuestionGroups';
import { useHandleQuestionSets } from '../../../services/useQuestionSets';
import { AppContext } from '../../../services/app';
import {
  ArticleSentence,
  ArticleSentenceForm,
  INITIAL_ARTICLE,
  State,
} from '../../../Model';
import { Action, ActionTypes } from '../../../Update';
import { getArticle } from '../../../services/article';

const ArticlePage = ({
  state,
  dispatch,
}: {
  state: State;
  dispatch: React.Dispatch<Action>;
}) => {
  const { articleId } = useParams();

  const { isFetching, memo, article, sentences } = state;

  useEffect(() => {
    if (!isFetching) return;

    if (!articleId) {
      dispatch({
        type: ActionTypes.setArticle,
        payload: {
          article: INITIAL_ARTICLE,
          sentences: [],
          articleSentenceForms: [],
        },
      });
      return;
    }

    const fetchData = async () => {
      let _article = INITIAL_ARTICLE;
      let _sentences: ArticleSentence[] = [];
      let _articleSentenceForms: ArticleSentenceForm[] = [];

      const memoArticle = memo.articles[articleId];
      const memoSentences = memo.sentences[articleId];
      const memoArticleSentenceForms = memo.articleSentenceForms[articleId];

      if (memoArticle && memoSentences && memoArticleSentenceForms) {
        _article = memoArticle;
        _sentences = memoSentences;
        _articleSentenceForms = memoArticleSentenceForms;
      } else {
        const { article, sentences, articleSentenceForms } = await getArticle(
          articleId
        );
        _article = article;
        _sentences = sentences;
        _articleSentenceForms = articleSentenceForms;
      }

      dispatch({
        type: ActionTypes.setArticle,
        payload: {
          article: _article,
          sentences: _sentences,
          articleSentenceForms: _articleSentenceForms,
        },
      });
    };
    fetchData();
  }, [isFetching, articleId]);

  const navigate = useNavigate();
  const { setQuestionSetId } = useContext(AppContext);

  const { createAccentsQuestions, createRhythmQuestions } =
    useHandleQuestions();
  const { createInitialQuestionGroup, updateQuestionGroup } =
    useHandleQuestionGroups();
  const { createAccentsQuestionSet, createRhythmQuestionSet } =
    useHandleQuestionSets();

  const createAccentsQuestion = async () => {
    const questionGroup = await createInitialQuestionGroup();

    if (!!questionGroup) {
      const docIds = await createAccentsQuestions({
        sentences: sentences,
        questionGroupId: questionGroup.id,
      });
      if (!!docIds.length) {
        const updatedQuestionGroup: QuestionGroup = {
          ...questionGroup,
          questions: docIds,
        };
        const result = await updateQuestionGroup(updatedQuestionGroup);
        if (!!result) {
          const createdQuestionSet = await createAccentsQuestionSet({
            title: article.title,
            questionGroupId: questionGroup.id,
            sentences: sentences,
          });
          if (!!createdQuestionSet) {
            setQuestionSetId(createdQuestionSet.id);
            navigate(`/accentsQuestion/${createdQuestionSet.id}`);
          }
        }
      }
    }
  };

  const createRhythmsQuestion = async () => {
    const questionGroup = await createInitialQuestionGroup();
    if (!!questionGroup) {
      const docIds = await createRhythmQuestions({
        sentences: sentences,
        downloadURL: article.downloadURL,
        questinGroupId: questionGroup.id,
      });
      if (!!docIds.length) {
        const updatedQuestionGroup: QuestionGroup = {
          ...questionGroup,
          questions: docIds,
        };
        const result = await updateQuestionGroup(updatedQuestionGroup);
        if (!!result) {
          const createdQuestionSet = await createRhythmQuestionSet({
            title: article.title,
            questionGroupId: questionGroup.id,
            accentsArray: sentences.map((sentence) => sentence.accents),
          });
          if (!!createdQuestionSet) {
            setQuestionSetId(createdQuestionSet.id);
            navigate(`/rhythmsQuestion/${createdQuestionSet.id}`);
          }
        }
      }
    }
  };

  // データ取得中
  if (isFetching) return <></>;
  // article が 初期値
  if (!article.id) return <Navigate to={'/article/list'} />;
  return (
    <ArticlePageComponent
      state={state}
      dispatch={dispatch}
      createAccentsQuestion={createAccentsQuestion}
      createRhythmsQuestion={createRhythmsQuestion}
    />
  );
};

export default ArticlePage;
