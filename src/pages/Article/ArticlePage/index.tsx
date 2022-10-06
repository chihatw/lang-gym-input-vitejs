import * as R from 'ramda';
import { Navigate, useNavigate, useParams } from 'react-router-dom';
import React, { useContext, useEffect, useState } from 'react';

import { Article, ArticleSentence, Quiz, State } from '../../../Model';
import { ActionTypes } from '../../../Update';
import {
  getArticle,
  getSentences,
  getBlobFromArticleDownloadURL,
} from '../../../services/article';
import TableLayout from '../../../components/templates/TableLayout';
import { Button } from '@mui/material';
import SentenceRow from './SentenceRow';
import {
  buildPitchQuizFromState,
  buildRhythmQuizFromState,
  createQuiz,
} from '../../../services/quiz';
import InitializeSentencesPane from './InitializeSentencesPane';
import { AppContext } from '../../../App';

const ArticlePage = () => {
  const navigate = useNavigate();
  const [isSm, setIsSm] = useState(true);
  const { state, dispatch } = useContext(AppContext);
  const { articleId } = useParams();
  const [initializing, setInitializing] = useState(true);

  if (!articleId) return <></>;

  useEffect(() => {
    if (!state.users.length) return;
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
      setInitializing(false);
    };
    fetchData();
  }, [articleId, state.blobs, state.users, state.audioContext, initializing]);

  const handleCreatePitchQuiz = async () => {
    const quiz = buildPitchQuizFromState(state, articleId);
    // update remote
    await createQuiz(quiz);

    const updatedState = R.assocPath<Quiz, State>(
      ['quizzes', quiz.id],
      quiz
    )(state);

    // update appState
    dispatch({
      type: ActionTypes.setState,
      payload: updatedState,
    });

    navigate(`/quiz/pitch/${quiz.id}`);
  };

  const handleCreateRhythmQuiz = async () => {
    if (!dispatch) return;
    const quiz = buildRhythmQuizFromState(state, articleId);
    await createQuiz(quiz);
    const updatedState = R.assocPath<Quiz, State>(
      ['quizzes', quiz.id],
      quiz
    )(state);
    dispatch({
      type: ActionTypes.setState,
      payload: updatedState,
    });
    navigate(`/quiz/rhythm/${quiz.id}`);
  };

  // データ取得中
  if (initializing) return <></>;
  const article = state.articles[articleId];
  // article が 初期値
  if (!article.title) return <Navigate to={'/article/list'} />;
  return (
    <TableLayout
      maxWidth={isSm ? 'sm' : 'md'}
      title={article.title}
      backURL={`/article/list`}
    >
      <div style={{ marginBottom: 16 }}>
        <Button size='small' variant='contained' onClick={() => setIsSm(!isSm)}>
          switch width
        </Button>
      </div>
      {!!state.sentences[articleId].length ? (
        <div style={{ display: 'grid', rowGap: 16 }}>
          {state.sentences[articleId].map((sentence, sentenceIndex) => (
            <SentenceRow
              key={sentenceIndex}
              articleId={articleId}
              sentence={sentence}
              blob={state.blobs[article.downloadURL]}
            />
          ))}

          <Button variant='contained' onClick={handleCreatePitchQuiz}>
            アクセント問題作成
          </Button>
          <Button variant='contained' onClick={handleCreateRhythmQuiz}>
            リズム問題作成
          </Button>
        </div>
      ) : (
        <InitializeSentencesPane articleId={articleId} />
      )}
    </TableLayout>
  );
};

export default ArticlePage;
