import { useParams } from 'react-router-dom';

import { useNavigate } from 'react-router-dom';
import React, { useEffect, useReducer } from 'react';
import { Divider } from '@mui/material';

import {
  Article,
  ArticleSentence,
  ArticleSentenceForm,
  INITIAL_ARTICLE,
  State,
} from '../../../Model';
import { getUsers } from '../../../services/user';
import {
  buildArticleEditState,
  buildArticleMarks,
  getArticle,
  setArticle,
} from '../../../services/article';
import { Action, ActionTypes } from '../../../Update';

import EditArticleVoicePane from './EditArticleVoicePane';
import { ArticleEditActionTypes, articleEditReducer } from './Update';
import { INITIAL_ARTICLE_EDIT_STATE } from './Model';
import EditArticleForm from './EditArticleForm';
import { nanoid } from 'nanoid';

const EditArticlePage = ({
  state,
  dispatch,
}: {
  state: State;
  dispatch: React.Dispatch<Action>;
}) => {
  const { articleId } = useParams();

  const navigate = useNavigate();
  const { article, isFetching, users, memo } = state;

  useEffect(() => {
    if (!isFetching) return;
    const fetchData = async () => {
      let _users = !!users.length ? users : await getUsers();
      if (!articleId) {
        dispatch({
          type: ActionTypes.setArticleForm,
          payload: {
            users: _users,
            article: INITIAL_ARTICLE,
            sentences: [],
            articleBlob: null,
            articleSentenceForms: [],
          },
        });
        return;
      }
      let _article = INITIAL_ARTICLE;
      let _sentences: ArticleSentence[] = [];
      let _articleBlob: Blob | null = null;
      let _articleSentenceForms: ArticleSentenceForm[] = [];

      const memoArticle = memo.articles[articleId];
      const memoSentences = memo.sentences[articleId];
      const memoArticleBlob = memo.articleBlobs[articleId];
      const memoArticleSentenceForms = memo.articleSentenceForms[articleId];
      if (
        memoArticle &&
        memoSentences &&
        memoArticleSentenceForms &&
        memoArticleBlob !== undefined
      ) {
        _article = memoArticle;
        _sentences = memoSentences;
        _articleBlob = memoArticleBlob;
        _articleSentenceForms = memoArticleSentenceForms;
      } else {
        const { article, sentences, articleSentenceForms, articleBlob } =
          await getArticle(articleId);
        _article = article;
        _sentences = sentences;
        _articleBlob = articleBlob;
        _articleSentenceForms = articleSentenceForms;
      }

      dispatch({
        type: ActionTypes.setArticleForm,
        payload: {
          users: _users,
          article: _article,
          sentences: _sentences,
          articleBlob: _articleBlob,
          articleSentenceForms: _articleSentenceForms,
        },
      });
    };
    fetchData();
  }, [isFetching]);

  const [articleEditState, articleEditDispatch] = useReducer(
    articleEditReducer,
    INITIAL_ARTICLE_EDIT_STATE
  );

  useEffect(() => {
    const initialState = buildArticleEditState(state);
    articleEditDispatch({
      type: ArticleEditActionTypes.initialize,
      payload: initialState,
    });
  }, [state]);

  const create = async () => {
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
        articleSentenceForms: [],
      },
    });
    setArticle(article);
    navigate(`/article/list`);
  };

  const update = async () => {
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

    dispatch({ type: ActionTypes.setArticleSingle, payload: newArticle });
    setArticle(newArticle);
    navigate('/article/list');
  };

  const handleSubmit = () => {
    if (!!article.id) {
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
      {!!article.id && (
        <>
          <Divider />
          <EditArticleVoicePane state={state} dispatch={dispatch} />
        </>
      )}
    </div>
  );
};

export default EditArticlePage;
