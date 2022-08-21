import * as R from 'ramda';
import { useParams } from 'react-router-dom';

import { useNavigate } from 'react-router-dom';
import React, { useContext, useEffect, useReducer } from 'react';
import { Divider } from '@mui/material';

import {
  Article,
  ArticleSentence,
  INITIAL_ARTICLE,
  State,
} from '../../../Model';
import {
  buildArticleEditState,
  buildArticleMarks,
  getArticle,
  setArticle,
} from '../../../services/article';
import { ActionTypes } from '../../../Update';

import EditArticleVoicePane from './EditArticleVoicePane';
import { articleEditReducer } from './Update';
import { INITIAL_ARTICLE_EDIT_STATE } from './Model';
import EditArticleForm from './EditArticleForm';
import { nanoid } from 'nanoid';
import { AppContext } from '../../../App';

const EditArticlePage = () => {
  const { state, dispatch } = useContext(AppContext);
  const { articleId } = useParams();
  if (!articleId) return <></>;

  const navigate = useNavigate();

  useEffect(() => {
    if (!state.isFetching || !dispatch) return;
    const fetchData = async () => {
      let _article = INITIAL_ARTICLE;
      let _sentences: ArticleSentence[] = [];
      let _articleBlob: Blob | null = null;

      const memoArticle = state.memo.articles[articleId];
      const memoSentences = state.memo.sentences[articleId];
      let memoArticleBlob = undefined;
      if (!!memoArticle && !!memoArticle.downloadURL) {
        memoArticleBlob = state.blobs[memoArticle.downloadURL];
      }

      if (memoArticle && memoSentences && memoArticleBlob !== undefined) {
        _article = memoArticle;
        _sentences = memoSentences;
        _articleBlob = memoArticleBlob;
      } else {
        const { article, sentences, articleBlob } = await getArticle(articleId);
        _article = article;
        _sentences = sentences;
        _articleBlob = articleBlob;
      }

      const updatedBlobs = { ...state.blobs };
      if (_articleBlob) {
        updatedBlobs[_article.downloadURL] = _articleBlob;
      }

      const updatedState = R.compose(
        R.assocPath<boolean, State>(['isFetching'], false),
        R.assocPath<Article, State>(['article'], _article),
        R.assocPath<{ [downloadURL: string]: Blob | null }, State>(
          ['blobs'],
          updatedBlobs
        ),
        R.assocPath<ArticleSentence[], State>(['sentences'], _sentences),
        R.assocPath<Article, State>(['memo', 'articles', articleId], _article),
        R.assocPath<ArticleSentence[], State>(
          ['memo', 'sentences', articleId],
          _sentences
        )
      )(state);

      dispatch({
        type: ActionTypes.setState,
        payload: updatedState,
      });
    };
    fetchData();
  }, [state.isFetching, state.memo]);

  const [articleEditState, articleEditDispatch] = useReducer(
    articleEditReducer,
    INITIAL_ARTICLE_EDIT_STATE
  );

  useEffect(() => {
    const initialState = buildArticleEditState(state);
    articleEditDispatch(initialState);
  }, [state]);

  const create = async () => {
    if (!dispatch) return;
    const { uid, date, users, title } = articleEditState;

    const article: Article = {
      ...INITIAL_ARTICLE,
      id: nanoid(8),
      uid,
      title,
      createdAt: date.getTime(),
      userDisplayname: users.filter((u) => u.id === uid)[0].displayname,
    };
    dispatch({
      type: ActionTypes.setArticle,
      payload: {
        article,
        sentences: [],
        articleBlob: null,
      },
    });
    setArticle(article);
    navigate(`/article/list`);
  };

  const update = async () => {
    if (!dispatch) return;
    const { articleMarksString, embedId, date, users, uid, title } =
      articleEditState;
    const articleMarks = buildArticleMarks(articleMarksString);

    const newArticle: Article = {
      ...state.article,
      uid,
      marks: articleMarks,
      title,
      embedID: embedId,
      createdAt: date.getTime(),
      userDisplayname: users.filter((u) => u.id === uid)[0].displayname,
    };

    let updatedList = [...state.articleList];
    const isCreateNew = !updatedList.find((item) => item.id === newArticle.id);
    if (isCreateNew) {
      updatedList.unshift(newArticle);
    } else {
      updatedList = updatedList.map((item) =>
        item.id === newArticle.id ? newArticle : item
      );
    }

    const updatedState = R.compose(
      R.assocPath<Article, State>(['article'], newArticle),
      R.assocPath<Article[], State>(['articleList'], updatedList),
      R.assocPath<Article, State>(
        ['memo', 'articles', newArticle.id],
        newArticle
      )
    )(state);

    dispatch({ type: ActionTypes.setState, payload: updatedState });
    setArticle(newArticle);
    navigate('/article/list');
  };

  const handleSubmit = () => {
    if (!!state.article.id) {
      update();
    } else {
      create();
    }
  };
  return (
    <div style={{ display: 'grid', rowGap: 16, paddingBottom: 120 }}>
      <EditArticleForm
        state={articleEditState}
        dispatch={articleEditDispatch}
        handleSubmit={handleSubmit}
      />
      {!!state.article.id && (
        <>
          <Divider />
          <EditArticleVoicePane />
        </>
      )}
    </div>
  );
};

export default EditArticlePage;
