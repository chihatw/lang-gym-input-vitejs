import { Button, Container } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import React, { useEffect, useReducer } from 'react';

import { deleteFile, uploadStorage } from '../../../repositories/file';

import { Article, ArticleSentence, State } from '../../../Model';
import { Action, ActionTypes } from '../../../Update';
import { setArticleVoiceInitialValue } from '../../../services/wave';
import { articleVoiceReducer } from './Update';
import { INITIAL_ARTICLE_VOICE_STATE } from './Model';
import EditAudioPane from './EditAudioPane';
import { setSentences, updateArticle } from '../../../services/article';

const EditArticleVoicePane = ({
  state,
  dispatch,
}: {
  state: State;
  dispatch: React.Dispatch<Action>;
}) => {
  const { article, sentences, articleBlob } = state;
  const { id: articleId, downloadURL } = article;

  const navigate = useNavigate();

  const [articleVoiceState, articleVoiceDispatch] = useReducer(
    articleVoiceReducer,
    INITIAL_ARTICLE_VOICE_STATE
  );

  useEffect(() => {
    setArticleVoiceInitialValue(state, articleVoiceDispatch);
  }, [state]);

  const uploadAudio = async (e: React.ChangeEvent<HTMLInputElement>) => {
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

      updateArticle(newArticle);
    };
    reader.readAsDataURL(file);
  };

  const updateMarks = async () => {
    const { marks } = articleVoiceState;
    const newSentences: ArticleSentence[] = sentences.map(
      (senetence, index) => ({
        ...senetence,
        start: marks[index].start,
        end: marks[index].end,
      })
    );
    dispatch({
      type: ActionTypes.updateSentences,
      payload: { articleId, sentences: newSentences },
    });

    setSentences(newSentences);
    navigate(`/article/list`);
  };
  const deleteAudio = () => {
    if (window.confirm('audio ファイルを削除しますか')) {
      const audioURL = new URL(downloadURL);
      const path = audioURL.pathname
        .split('/')
        .slice(-1)[0]
        .replace('%2F', '/');
      deleteFile(path);

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

      updateArticle(newArticle);
      setSentences(newSentences);
    }
  };

  return (
    <Container maxWidth='sm'>
      <div style={{ display: 'grid', rowGap: 16 }}>
        {articleBlob ? (
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
