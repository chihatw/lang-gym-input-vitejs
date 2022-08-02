import { Navigate, useParams } from 'react-router-dom';
import React, { useEffect } from 'react';

import ArticlePageComponent from './components/ArticlePageComponent';

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

  const { isFetching, memo, article } = state;

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

  // データ取得中
  if (isFetching) return <></>;
  // article が 初期値
  if (!article.id) return <Navigate to={'/article/list'} />;
  return <ArticlePageComponent state={state} dispatch={dispatch} />;
};

export default ArticlePage;
