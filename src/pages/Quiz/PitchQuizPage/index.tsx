import React, { useContext, useEffect, useReducer } from 'react';
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
  if (!quizId) return <></>;

  const { state, dispatch } = useContext(AppContext);

  const quiz = state.quizzes.find((item) => item.id === quizId);
  if (!quiz) return <></>;

  const [pitchQuizFormState, pitchQuizFormDispatch] = useReducer(
    pitchQuizFormReducer,
    INITIAL_PITCH_QUIZ_FORM_STATE
  );

  useEffect(() => {
    if (!dispatch || !state.isFetching) return;
    const updatedState: State = { ...state, isFetching: false };
    dispatch({ type: ActionTypes.setState, payload: updatedState });
    const pitchQuizFormState = buildPitchQuizFormState(updatedState, quizId);
    pitchQuizFormDispatch(pitchQuizFormState);
  }, [state.isFetching, quizId]);

  const handleSubmit = async () => {
    if (!dispatch) return;
    let questionCount = 0;
    const updatedQuestions: QuizQuestions = {};
    pitchQuizFormState.questions.forEach((question, sentenceIndex) => {
      updatedQuestions[sentenceIndex] = question;

      const pitchesArray = string2PitchesArray(question.pitchStr);
      questionCount += pitchesArray.length;
      questionCount -= question.disableds.length;
    });

    const updatedQuiz: Quiz = {
      ...quiz,
      uid: pitchQuizFormState.uid,
      title: pitchQuizFormState.title,
      scores: pitchQuizFormState.scores,
      questions: updatedQuestions,
      questionCount: questionCount,
    };
    const updatedQuizzes = state.quizzes.map((item) =>
      item.id !== quizId ? item : updatedQuiz
    );
    const updatedState: State = {
      ...state,
      quizzes: updatedQuizzes,
    };
    dispatch({ type: ActionTypes.setState, payload: updatedState });
    await setQuiz(updatedQuiz);
    navigate(`/quiz/list`);
  };
  return (
    <PitchQuizForm
      state={pitchQuizFormState}
      dispatch={pitchQuizFormDispatch}
      handleSubmit={handleSubmit}
    />
  );
};

export default PitchQuizPage;
