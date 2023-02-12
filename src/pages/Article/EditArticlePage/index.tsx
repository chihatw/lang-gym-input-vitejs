import * as R from 'ramda';
import { useParams } from 'react-router-dom';
import { useContext, useEffect, useReducer, useState } from 'react';
import { Button, Divider } from '@mui/material';

import {
  State,
  Article,
  ArticleSentence,
  INITIAL_ARTICLE,
} from '../../../Model';
import {
  getArticle,
  getSentences,
  buildArticleEditState,
  getBlobFromArticleDownloadURL,
} from '../../../services/article';
import { ActionTypes } from '../../../Update';

import EditArticleVoicePane from './EditArticleVoicePane';
import {
  ArticleEditState,
  INITIAL_ARTICLE_EDIT_STATE,
  INITIAL_ARTICLE_VOICE_STATE,
} from './Model';
import EditArticleForm from './EditArticleForm';
import { nanoid } from 'nanoid';
import { AppContext } from '../../../App';
import AudioContextFactory from '../../../services/AudioContextFactory';

const reducer = (
  state: ArticleEditState,
  payload: ArticleEditState
): ArticleEditState => payload;

const EditArticlePage = () => {
  const { state, dispatch } = useContext(AppContext);
  const { articleId } = useParams();
  const [initializing, setInitializing] = useState(true);
  const [formState, formDispatch] = useReducer(
    reducer,
    INITIAL_ARTICLE_EDIT_STATE
  );

  useEffect(() => {
    if (!state.users.length) return;

    // 新規作成の場合
    if (!articleId) {
      const article: Article = {
        ...INITIAL_ARTICLE,
        id: nanoid(8),
        uid: state.users[0].id,
        createdAt: Date.now(),
        userDisplayname: state.users[0].displayname,
      };

      formDispatch({
        blob: null,
        users: state.users,
        article,
        sentences: [],
        audioContext: state.audioContext,
        wave: INITIAL_ARTICLE_VOICE_STATE,
      });
      setInitializing(false);
      return;
    }

    // 更新の場合
    const fetchData = async () => {
      // メモになければ、remote から取得
      const article =
        state.articles[articleId] || (await getArticle(articleId));

      // メモになくて、初期化中なら、remote から取得
      const sentences: ArticleSentence[] = !!state.sentences[articleId]
        ? state.sentences[articleId]
        : initializing
        ? await getSentences(articleId)
        : [];

      // update state.articles and state.sentences
      let updatedState = R.compose(
        R.assocPath<Article, State>(['articles', article.id], article),
        R.assocPath<ArticleSentence[], State>(
          ['sentences', articleId],
          sentences
        )
      )(state);

      let articleBlob: Blob | null = null;
      if (article.downloadURL) {
        // メモにあれば、それを使用
        if (state.blobs[article.downloadURL]) {
          articleBlob = state.blobs[article.downloadURL];
        }
        // メモにない場合、初期化中なら remote から取得
        else {
          articleBlob = initializing
            ? await getBlobFromArticleDownloadURL(article.downloadURL)
            : null;
          // update state.blobs
          if (articleBlob) {
            updatedState = R.assocPath<Blob, State>(
              ['blobs', article.downloadURL],
              articleBlob
            )(updatedState);
          }
        }
      }

      dispatch({
        type: ActionTypes.setState,
        payload: updatedState,
      });

      // build formState
      const initialState = await buildArticleEditState(updatedState, articleId);
      formDispatch(initialState);
      setInitializing(false);
    };
    fetchData();
  }, [initializing, state.blobs, state.users, state.audioContext]);

  const handleClick = () => {
    const audioContextFactory = new AudioContextFactory();
    const audioContext = audioContextFactory.create();
    const updatedState = R.assocPath<AudioContext, State>(
      ['audioContext'],
      audioContext
    )(state);
    dispatch({ type: ActionTypes.setState, payload: updatedState });
  };

  if (initializing) return <></>;

  return (
    <div style={{ display: 'grid', rowGap: 16, paddingBottom: 120 }}>
      <EditArticleForm state={formState} dispatch={formDispatch} />

      <Divider />
      {state.audioContext && !!formState.sentences.length && (
        <EditArticleVoicePane state={formState} dispatch={formDispatch} />
      )}
      {!state.audioContext && formState.blob && (
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <Button
            variant='outlined'
            sx={{ width: 400, height: 60 }}
            onClick={handleClick}
          >
            Touch me
          </Button>
        </div>
      )}
    </div>
  );
};

export default EditArticlePage;
