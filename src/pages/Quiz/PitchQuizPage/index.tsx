import * as R from 'ramda';
import React, { useContext, useEffect, useReducer, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { buildPitchQuizFormState, setQuiz } from '../../../services/quiz';
import { AppContext } from '../../../App';
import { pitchQuizFormReducer } from './Update';
import { INITIAL_PITCH_QUIZ_FORM_STATE } from './Model';
import PitchQuizForm from './PitchQuizForm';
import string2PitchesArray from 'string2pitches-array';
import { ActionTypes } from '../../../Update';
import { State, Quiz, QuizQuestions } from '../../../Model';

const PitchQuizPage = () => {
  const { quizId } = useParams();
  const navigate = useNavigate();
  const [initializing, setInitializing] = useState(true);
  if (!quizId) return <></>;

  const { state, dispatch } = useContext(AppContext);

  const quiz = state.quizzes[quizId];

  const [pitchQuizFormState, pitchQuizFormDispatch] = useReducer(
    pitchQuizFormReducer,
    INITIAL_PITCH_QUIZ_FORM_STATE
  );

  useEffect(() => {
    if (!initializing || !state.users.length) return;

    const fetchData = async () => {
      const pitchQuizFormState = await buildPitchQuizFormState(state, quizId);

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

    const updatedQuiz: Quiz = {
      ...quiz!,
      uid: pitchQuizFormState.uid,
      title: pitchQuizFormState.title,
      scores: pitchQuizFormState.scores,
      questions: updatedQuestions,
      questionCount: questionCount,
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
