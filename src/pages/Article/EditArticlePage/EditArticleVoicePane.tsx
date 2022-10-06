import * as R from 'ramda';
import { Button, Container } from '@mui/material';
import React, { useContext } from 'react';

import { deleteFile, uploadStorage } from '../../../repositories/file';

import { Article, ArticleSentence } from '../../../Model';
import { ActionTypes } from '../../../Update';

import { ArticleEditState, ArticleVoiceState } from './Model';
import EditAudioPane from './EditAudioPane';
import { setSentences, setArticle } from '../../../services/article';
import { AppContext } from '../../../App';
import { buildArticleVoiceState } from '../../../services/wave';

const EditArticleVoicePane = ({
  state,
  dispatch,
}: {
  state: ArticleEditState;
  dispatch: React.Dispatch<ArticleEditState>;
}) => {
  const { dispatch: appDispatch } = useContext(AppContext);

  const uploadAudio = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const path = `/articles/${state.article.id}`;
    if (!e.target.files) return;
    const file = e.target.files[0];

    const reader = new FileReader();
    reader.onload = async () => {
      const response = await fetch(reader.result as string);
      const blob = await response.blob();

      uploadStorage(blob, path);
      const updatedArticle: Article = {
        ...state.article,
        downloadURL: path,
      };

      // update appState
      appDispatch({
        type: ActionTypes.uploadArticleAudioFile,
        payload: { article: updatedArticle, articleBlob: blob },
      });

      // update remote
      setArticle(updatedArticle);

      // update formState
      const { wave, sentences } = await buildArticleVoiceState({
        blob,
        sentences: state.sentences,
        audioContext: state.audioContext!,
      });

      const updatedState = R.compose(
        R.assocPath<Blob, ArticleEditState>(['blob'], blob),
        R.assocPath<Article, ArticleEditState>(['article'], updatedArticle),
        R.assocPath<ArticleVoiceState, ArticleEditState>(['wave'], wave),
        R.assocPath<ArticleSentence[], ArticleEditState>(
          ['sentences'],
          sentences
        )
      )(state);
      dispatch(updatedState);
    };
    reader.readAsDataURL(file);
  };

  const deleteAudio = () => {
    if (window.confirm('audio ファイルを削除しますか')) {
      let path = '';
      const header = state.article.downloadURL.slice(0, 4);
      if (header === 'http') {
        const audioURL = new URL(state.article.downloadURL);
        path = audioURL.pathname.split('/').slice(-1)[0].replace('%2F', '/');
        // update remote storage
        deleteFile(path);
      } else {
        path = state.article.downloadURL;
      }

      const updatedArticle: Article = { ...state.article, downloadURL: '' };
      const updatedSentences: ArticleSentence[] = state.sentences.map(
        (sentence) => ({
          ...sentence,
          start: 0,
          end: 0,
        })
      );
      // update appState
      appDispatch({
        type: ActionTypes.deleteArticleAudioFile,
        payload: { article: updatedArticle, sentences: updatedSentences },
      });

      // update remote
      setArticle(updatedArticle);
      setSentences(updatedSentences);

      // update formState
      const updatedState = R.compose(
        R.assocPath<Article, ArticleEditState>(['article'], updatedArticle),
        R.assocPath<ArticleSentence[], ArticleEditState>(
          ['sentences'],
          updatedSentences
        ),
        R.assocPath<null, ArticleEditState>(['blob'], null)
      )(state);
      dispatch(updatedState);
    }
  };

  return (
    <Container maxWidth='sm'>
      <div style={{ display: 'grid', rowGap: 16 }}>
        {state.blob ? (
          <EditAudioPane
            state={state}
            dispatch={dispatch}
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
