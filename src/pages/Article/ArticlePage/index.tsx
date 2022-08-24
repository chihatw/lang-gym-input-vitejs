import * as R from 'ramda';
import { Navigate, useNavigate, useParams } from 'react-router-dom';
import React, { useContext, useEffect, useState } from 'react';

import {
  Article,
  ArticleSentence,
  INITIAL_ARTICLE,
  State,
} from '../../../Model';
import { ActionTypes } from '../../../Update';
import { getArticle } from '../../../services/article';
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
  const { state, dispatch } = useContext(AppContext);
  const { articleId } = useParams();
  if (!articleId) return <></>;

  const article = state.articles[articleId];
  if (!article) return <></>;

  const navigate = useNavigate();
  const [isSm, setIsSm] = useState(true);

  useEffect(() => {
    if (!state.isFetching || !dispatch) return;

    const fetchData = async () => {
      let _sentences: ArticleSentence[] = [];
      let _articleBlob: Blob | null = null;

      const memoSentences = state.sentences[articleId];
      let memoArticleBlob = undefined;

      if (article.downloadURL) {
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
      if (article.downloadURL && _articleBlob) {
        updatedBlobs[article.downloadURL] = _articleBlob;
      }
      const updatedState = R.compose(
        R.assocPath<boolean, State>(['isFetching'], false),
        R.assocPath<{ [downloadURL: string]: Blob | null }, State>(
          ['blobs'],
          updatedBlobs
        ),
        R.assocPath<ArticleSentence[], State>(
          ['sentences', articleId],
          _sentences
        )
      )(state);

      dispatch({ type: ActionTypes.setState, payload: updatedState });
    };
    fetchData();
  }, [state.isFetching, articleId, state.memo]);

  const handleCreatePitchQuiz = async () => {
    if (!dispatch) return;
    const quiz = buildPitchQuizFromState(state, articleId);
    await createQuiz(quiz);
    const updatedQuizzes = [...state.quizzes];
    updatedQuizzes.unshift(quiz);
    const updatedState: State = {
      ...state,
      quizzes: updatedQuizzes,
      isFetching: true,
    };
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
    const updatedQuizzes = [...state.quizzes];
    updatedQuizzes.unshift(quiz);
    const updatedState: State = {
      ...state,
      quizzes: updatedQuizzes,
      isFetching: true,
    };
    dispatch({
      type: ActionTypes.setState,
      payload: updatedState,
    });
    navigate(`/quiz/rhythm/${quiz.id}`);
  };

  // データ取得中
  if (state.isFetching) return <></>;
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
