import { useNavigate, useParams } from 'react-router-dom';
import React, { useContext, useEffect, useReducer } from 'react';
import {
  setQuiz,
  getBlob,
  buildRhythmInitialValues,
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
  if (!quizId) return <></>;

  const { state, dispatch } = useContext(AppContext);

  const quiz = state.quizzes.find((item) => item.id === quizId);
  if (!quiz) return <></>;

  const [rhythmQuizFormState, rhythmQuizFormDispatch] = useReducer(
    rhythmQuizFormReducer,
    INITIAL_RHYTHM_QUIZ_FORM_STATE
  );

  useEffect(() => {
    if (!dispatch || !state.isFetching) return;

    const fetchData = async () => {
      let blob: Blob | null = null;
      if (quiz.downloadURL) {
        blob =
          state.blobs[quiz.downloadURL] || (await getBlob(quiz.downloadURL));
      }
      const updatedBlobs = { ...state.blobs };

      if (blob) {
        updatedBlobs[quiz.downloadURL] = blob;
      }

      const updatedState: State = {
        ...state,
        blobs: updatedBlobs,
        isFetching: false,
      };
      dispatch({ type: ActionTypes.setState, payload: updatedState });
      const rhythmQuizFormState = buildRhythmInitialValues(
        updatedState,
        quizId
      );
      rhythmQuizFormDispatch(rhythmQuizFormState);
    };

    fetchData();
  }, [state.isFetching, quiz, state.blobs, state.audioContext]);

  const onSubmit = async () => {
    if (!dispatch) return;
    let questionCount = 0;
    const updatedQuestions: QuizQuestions = {};
    rhythmQuizFormState.questions.forEach((question, sentenceIndex) => {
      updatedQuestions[sentenceIndex] = question;

      questionCount += Object.keys(question.syllables).length;
      questionCount -= question.disableds.length;
    });

    const updatedQuiz: Quiz = {
      ...quiz,
      uid: rhythmQuizFormState.uid,
      title: rhythmQuizFormState.title,
      scores: rhythmQuizFormState.scores,
      questions: updatedQuestions,
      questionCount,
    };
    const updatedQuizzes = state.quizzes.map((item) =>
      item.id === quizId ? updatedQuiz : item
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
    <RhythmQuizForm
      state={rhythmQuizFormState}
      dispatch={rhythmQuizFormDispatch}
      onSubmit={onSubmit}
    />
  );
};

export default RhythmQuizPage;
