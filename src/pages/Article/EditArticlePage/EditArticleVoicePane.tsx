import * as R from 'ramda';
import { Button, Container } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import React, { useContext, useEffect, useReducer } from 'react';

import { deleteFile, uploadStorage } from '../../../repositories/file';

import { Article, ArticleSentence, State } from '../../../Model';
import { Action, ActionTypes } from '../../../Update';
import { setArticleVoiceInitialValue } from '../../../services/wave';
import { articleVoiceReducer } from './Update';
import { INITIAL_ARTICLE_VOICE_STATE } from './Model';
import EditAudioPane from './EditAudioPane';
import { setSentences, setArticle } from '../../../services/article';
import { AppContext } from '../../../App';

const EditArticleVoicePane = () => {
  const { state, dispatch } = useContext(AppContext);
  const { article, sentences, blobs } = state;
  const { id: articleId, downloadURL } = article;

  let blob: Blob | null = null;
  if (downloadURL) {
    blob = blobs[downloadURL];
  }

  const navigate = useNavigate();

  const [articleVoiceState, articleVoiceDispatch] = useReducer(
    articleVoiceReducer,
    INITIAL_ARTICLE_VOICE_STATE
  );

  useEffect(() => {
    setArticleVoiceInitialValue(state, articleVoiceDispatch);
  }, [state]);

  const uploadAudio = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!dispatch) return;
    const path = `/articles/${articleId}`;
    if (!e.target.files) return;
    const file = e.target.files[0];

    const reader = new FileReader();
    reader.onload = async () => {
      const response = await fetch(reader.result as string);
      const blob = await response.blob();

      uploadStorage(blob, path);
      const newArticle: Article = {
        ...article,
        downloadURL: path,
      };
      dispatch({
        type: ActionTypes.uploadArticleAudioFile,
        payload: { article: newArticle, articleBlob: blob },
      });

      setArticle(newArticle);
    };
    reader.readAsDataURL(file);
  };

  const updateMarks = async () => {
    if (!dispatch) return;
    const { marks } = articleVoiceState;
    const newSentences: ArticleSentence[] = sentences.map(
      (senetence, index) => ({
        ...senetence,
        start: marks[index].start,
        end: marks[index].end,
      })
    );

    const updatedState = R.compose(
      R.assocPath<ArticleSentence[], State>(['sentences'], newSentences),
      R.assocPath<ArticleSentence[], State>(
        ['memo', 'sentences', articleId],
        newSentences
      )
    )(state);

    dispatch({
      type: ActionTypes.setState,
      payload: updatedState,
    });

    setSentences(newSentences);
    navigate(`/article/list`);
  };
  const deleteAudio = () => {
    if (!dispatch) return;

    if (window.confirm('audio ファイルを削除しますか')) {
      let path = '';
      const header = downloadURL.slice(0, 4);
      if (header === 'http') {
        const audioURL = new URL(downloadURL);
        path = audioURL.pathname.split('/').slice(-1)[0].replace('%2F', '/');
        deleteFile(path);
      } else {
        path = downloadURL;
      }

      const newArticle: Article = { ...article, downloadURL: '' };
      const newSentences: ArticleSentence[] = sentences.map((sentence) => ({
        ...sentence,
        start: 0,
        end: 0,
      }));
      dispatch({
        type: ActionTypes.deleteArticleAudioFile,
        payload: { article: newArticle, sentences: newSentences },
      });

      setArticle(newArticle);
      setSentences(newSentences);
    }
  };

  return (
    <Container maxWidth='sm'>
      <div style={{ display: 'grid', rowGap: 16 }}>
        {blob ? (
          <EditAudioPane
            state={articleVoiceState}
            dispatch={articleVoiceDispatch}
            updateMarks={updateMarks}
            deleteAudio={deleteAudio}
          />
        ) : (
          <Button variant='contained' component='label'>
            Audio アップロード
            <input
              aria-label='audio mp3 upload'
              type='file'
              style={{ display: 'none' }}
              onChange={uploadAudio}
            />
          </Button>
        )}
      </div>
    </Container>
  );
};

export default EditArticleVoicePane;
