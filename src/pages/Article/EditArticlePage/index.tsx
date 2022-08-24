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
  const article = state.articles[articleId || ''];
  const navigate = useNavigate();

  useEffect(() => {
    if (!state.isFetching || !dispatch) return;
    if (!articleId) {
      const updatedState = R.compose(
        R.assocPath<boolean, State>(['isFetching'], false)
      )(state);

      dispatch({
        type: ActionTypes.setState,
        payload: updatedState,
      });
      return;
    }
    const fetchData = async () => {
      let _sentences: ArticleSentence[] = [];
      let _articleBlob: Blob | null = null;

      const memoSentences = state.sentences[articleId];
      let memoArticleBlob = undefined;
      if (!!article.downloadURL) {
        memoArticleBlob = state.blobs[article.downloadURL];
      }

      if (memoSentences && memoArticleBlob !== undefined) {
        _sentences = memoSentences;
        _articleBlob = memoArticleBlob;
      } else {
        const { sentences, articleBlob } = await getArticle(articleId);
        _sentences = sentences;
        _articleBlob = articleBlob;
      }
      const updatedBlobs = { ...state.blobs };
      if (_articleBlob) {
        updatedBlobs[article.downloadURL] = _articleBlob;
      }

      const updatedState = R.compose(
        R.assocPath<boolean, State>(['isFetching'], false),
        R.assocPath<{ [downloadURL: string]: Blob | null }, State>(
          ['blobs'],
          updatedBlobs
        ),
        R.assocPath<ArticleSentence[], State>(
          ['sentences', articleId || ''],
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
    const initialState = buildArticleEditState(state, articleId || '');
    articleEditDispatch(initialState);
  }, [state]);

  const create = async () => {
    if (!dispatch) return;
    const { uid, date, users, title } = articleEditState;

    const articleId = nanoid(8);
    const article: Article = {
      ...INITIAL_ARTICLE,
      id: articleId,
      uid,
      title,
      createdAt: date.getTime(),
      userDisplayname: users.filter((u) => u.id === uid)[0].displayname,
    };

    const updatedState = R.assocPath<Article, State>(
      ['articles', articleId],
      article
    )(state);
    dispatch({ type: ActionTypes.setState, payload: updatedState });
    setArticle(article);
    navigate(`/article/list`);
  };

  const update = async () => {
    if (!dispatch) return;
    const { articleMarksString, embedId, date, users, uid, title } =
      articleEditState;
    const articleMarks = buildArticleMarks(articleMarksString);

    const newArticle: Article = {
      ...article,
      uid,
      marks: articleMarks,
      title,
      embedID: embedId,
      createdAt: date.getTime(),
      userDisplayname: users.filter((u) => u.id === uid)[0].displayname,
    };

    const updatedState = R.compose(
      R.assocPath<Article, State>(['articles', newArticle.id], newArticle)
    )(state);

    dispatch({ type: ActionTypes.setState, payload: updatedState });
    setArticle(newArticle);
    navigate('/article/list');
  };

  const handleSubmit = () => {
    if (articleId) {
      update();
    } else {
      create();
    }
  };

  if (state.isFetching) return <></>;
  return (
    <div style={{ display: 'grid', rowGap: 16, paddingBottom: 120 }}>
      <EditArticleForm
        state={articleEditState}
        dispatch={articleEditDispatch}
        handleSubmit={handleSubmit}
      />
      {!!articleId && (
        <>
          <Divider />
          <EditArticleVoicePane
            article={article}
            blob={state.blobs[article.downloadURL]}
            sentences={state.sentences[articleId || '']}
          />
        </>
      )}
    </div>
  );
};

export default EditArticlePage;
