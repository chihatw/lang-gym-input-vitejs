import * as R from 'ramda';
import { useNavigate, useParams } from 'react-router-dom';
import React, { useContext, useEffect, useReducer, useState } from 'react';
import {
  setQuiz,
  getBlob,
  buildRhythmInitialValues,
  getQuiz,
} from '../../../services/quiz';

import { INITIAL_RHYTHM_QUIZ_FORM_STATE, RhythmQuizFromState } from './Model';
import RhythmQuizForm from './RhythmQuizForm';
import { AppContext } from '../../../App';
import { State, Quiz, QuizQuestions } from '../../../Model';
import { ActionTypes } from '../../../Update';

const reducer = (state: RhythmQuizFromState, action: RhythmQuizFromState) => {
  return action;
};

const RhythmQuizPage = () => {
  const { quizId } = useParams();
  const navigate = useNavigate();
  const { state, dispatch } = useContext(AppContext);
  const [initializing, setInitializing] = useState(true);
  const [rhythmQuizFormState, rhythmQuizFormDispatch] = useReducer(
    reducer,
    INITIAL_RHYTHM_QUIZ_FORM_STATE
  );
  if (!quizId) return <></>;

  useEffect(() => {
    if (!initializing || !state.users.length) return;

    const fetchData = async () => {
      let quiz: Quiz | null = null;
      let updatedState = state;

      if (state.quizzes[quizId]) {
        quiz = state.quizzes[quizId];
      } else {
        quiz = await getQuiz(quizId);
        updatedState = R.assocPath<Quiz, State>(
          ['quizzes', quiz.id],
          quiz
        )(state);
      }

      let blob: Blob | null = null;
      if (quiz.downloadURL) {
        if (state.blobs[quiz.downloadURL]) {
          blob = state.blobs[quiz.downloadURL];
        } else {
          blob = await getBlob(quiz.downloadURL);
          if (blob) {
            updatedState = R.assocPath<Blob, State>(
              ['blobs', quiz.downloadURL],
              blob
            )(state);
          }
        }
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

    const quiz = state.quizzes[quizId];

    const updatedQuiz: Quiz = {
      ...quiz,
      uid: rhythmQuizFormState.uid,
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
