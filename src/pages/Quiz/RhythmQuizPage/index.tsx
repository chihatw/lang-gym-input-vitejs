import * as R from 'ramda';
import { useNavigate, useParams } from 'react-router-dom';
import React, { useContext, useEffect, useReducer, useState } from 'react';
import {
  setQuiz,
  getBlob,
  buildRhythmInitialValues,
  getQuiz,
} from '../../../services/quiz';
import { rhythmQuizFormReducer } from './Update';
import { INITIAL_RHYTHM_QUIZ_FORM_STATE } from './Model';
import RhythmQuizForm from './RhythmQuizForm';
import { AppContext } from '../../../App';
import { State, Quiz, QuizQuestions } from '../../../Model';
import { ActionTypes } from '../../../Update';

const RhythmQuizPage = () => {
  const { quizId } = useParams();
  const navigate = useNavigate();
  const [initializing, setInitializing] = useState(true);
  if (!quizId) return <></>;

  const { state, dispatch } = useContext(AppContext);

  const [rhythmQuizFormState, rhythmQuizFormDispatch] = useReducer(
    rhythmQuizFormReducer,
    INITIAL_RHYTHM_QUIZ_FORM_STATE
  );

  useEffect(() => {
    if (!initializing || !state.users.length) return;

    const fetchData = async () => {
      const quiz = state.quizzes[quizId] || (await getQuiz(quizId));

      let updatedState = R.assocPath<Quiz, State>(
        ['quizzes', quiz.id],
        quiz
      )(state);

      let blob: Blob | null = null;
      if (quiz.downloadURL) {
        blob =
          state.blobs[quiz.downloadURL] || (await getBlob(quiz.downloadURL));

        updatedState = R.assocPath<Blob, State>(
          ['blobs', quiz.downloadURL],
          blob
        )(state);
      }

      const updatedBlobs = { ...state.blobs };
      if (blob) {
        updatedBlobs[quiz.downloadURL] = blob;
      }

      dispatch({ type: ActionTypes.setState, payload: updatedState });
      const rhythmQuizFormState = buildRhythmInitialValues(
        updatedState,
        quizId
      );
      rhythmQuizFormDispatch(rhythmQuizFormState);
      setInitializing(false);
    };

    fetchData();
  }, [state.users, state.blobs, state.audioContext]);

  const onSubmit = async () => {
    let questionCount = 0;
    const updatedQuestions: QuizQuestions = {};
    rhythmQuizFormState.questions.forEach((question, sentenceIndex) => {
      updatedQuestions[sentenceIndex] = question;

      questionCount += Object.keys(question.syllables).length;
      questionCount -= question.disableds.length;
    });

    const updatedQuiz: Quiz = {
      id: quizId,
      uid: rhythmQuizFormState.uid,
      type: rhythmQuizFormState.type,
      createdAt: rhythmQuizFormState.createdAt,
      downloadURL: rhythmQuizFormState.downloadURL,
      title: rhythmQuizFormState.title,
      scores: rhythmQuizFormState.scores,
      questions: updatedQuestions,
      questionCount,
    };

    const updatedState = R.assocPath<Quiz, State>(
      ['quizzes', quizId],
      updatedQuiz
    )(state);
    dispatch({ type: ActionTypes.setState, payload: updatedState });
    await setQuiz(updatedQuiz);
    navigate(`/quiz/list`);
  };

  return (
    <RhythmQuizForm
      state={rhythmQuizFormState}
      dispatch={rhythmQuizFormDispatch}
      onSubmit={onSubmit}
    />
  );
};

export default RhythmQuizPage;
