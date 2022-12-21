import * as R from 'ramda';
import React, { useContext, useEffect, useReducer, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  buildPitchQuizFormState,
  getBlob,
  getQuiz,
  setQuiz,
} from '../../../services/quiz';
import { AppContext } from '../../../App';

import { INITIAL_PITCH_QUIZ_FORM_STATE, PitchQuizFormState } from './Model';
import PitchQuizForm from './PitchQuizForm';
import string2PitchesArray from 'string2pitches-array';
import { ActionTypes } from '../../../Update';
import { State, Quiz, QuizQuestions } from '../../../Model';

const reducer = (
  state: PitchQuizFormState,
  action: PitchQuizFormState
): PitchQuizFormState => {
  return action;
};

const PitchQuizPage = () => {
  const { quizId } = useParams();
  const navigate = useNavigate();
  const { state, dispatch } = useContext(AppContext);
  const [initializing, setInitializing] = useState(true);
  const [pitchQuizFormState, pitchQuizFormDispatch] = useReducer(
    reducer,
    INITIAL_PITCH_QUIZ_FORM_STATE
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
      const pitchQuizFormState = buildPitchQuizFormState(state, quizId);
      pitchQuizFormDispatch(pitchQuizFormState);
      setInitializing(false);
    };
    fetchData();
  }, [state.users, quizId]);

  const handleSubmit = async () => {
    let questionCount = 0;
    const updatedQuestions: QuizQuestions = {};
    pitchQuizFormState.questions.forEach((question, sentenceIndex) => {
      updatedQuestions[sentenceIndex] = question;

      const pitchesArray = string2PitchesArray(question.pitchStr);
      questionCount += pitchesArray.length;
      questionCount -= question.disableds.length;
    });

    const quiz = state.quizzes[quizId];
    const updatedQuiz: Quiz = {
      ...quiz,
      uid: pitchQuizFormState.uid,
      title: pitchQuizFormState.title,
      scores: pitchQuizFormState.scores,
      questions: updatedQuestions,
      questionCount,
    };

    // update appState
    const updatedState = R.assocPath<Quiz, State>(
      ['quizzes', quizId],
      updatedQuiz
    )(state);
    dispatch({ type: ActionTypes.setState, payload: updatedState });

    // update remote
    await setQuiz(updatedQuiz);

    navigate(`/quiz/list`);
  };

  if (initializing) return <></>;
  if (!pitchQuizFormState.title) return <></>;
  return (
    <PitchQuizForm
      state={pitchQuizFormState}
      dispatch={pitchQuizFormDispatch}
      handleSubmit={handleSubmit}
    />
  );
};

export default PitchQuizPage;
