import React, { useContext, useEffect, useReducer } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { buildAccentQuizFormState, submitQuiz } from '../../../services/quiz';
import { AppContext } from '../../../App';
import { accentQuizFormReducer } from './Update';
import { INITIAL_ACCENT_QUIZ_FORM_STATE } from './Model';
import AccentQuizForm from './AccentQuizForm';
import string2PitchesArray from 'string2pitches-array';
import { Quiz, QuizQuestion, QuizQuestions } from '../../TempPage/service';
import { ActionTypes } from '../../../Update';
import { State } from '../../../Model';

const AccentQuizPage = () => {
  const { quizId } = useParams();
  const navigate = useNavigate();
  if (!quizId) return <></>;

  const { state, dispatch } = useContext(AppContext);
  const { users, quizzes } = state;
  const quiz = quizzes.find((item) => item.id === quizId);
  if (!quiz) return <></>;

  const [accentQuizFormState, accentQuizFormDispatch] = useReducer(
    accentQuizFormReducer,
    INITIAL_ACCENT_QUIZ_FORM_STATE
  );

  useEffect(() => {
    const accentQuizFormState = buildAccentQuizFormState(quiz, users);
    accentQuizFormDispatch(accentQuizFormState);
  }, [quiz]);

  const handleSubmit = async () => {
    if (!dispatch) return;
    let questionCount = 0;
    const japaneses = accentQuizFormState.japanese.split('\n');
    const pitchStrs = accentQuizFormState.pitchStr.split('\n');
    const pitchesArrays = pitchStrs.map((pitchStr) =>
      string2PitchesArray(pitchStr)
    );

    pitchesArrays.forEach((pitchesArray, sentenceIndex) => {
      questionCount += pitchesArray.length;

      if (accentQuizFormState.disabledsArray[sentenceIndex]) {
        questionCount -=
          accentQuizFormState.disabledsArray[sentenceIndex].length;
      }
    });

    const updatedQuestions: QuizQuestions = {};

    pitchStrs.forEach((pitchStr, index) => {
      const question = quiz.questions[index];
      const updatedQuestion: QuizQuestion = {
        pitchStr,
        japanese: japaneses[index],
        disableds: accentQuizFormState.disabledsArray[index] || [],
        end: question?.end || 0,
        start: question?.start || 0,
        syllables: question?.syllables || {},
      };
      updatedQuestions[index] = updatedQuestion;
    });
    const updatedQuiz: Quiz = {
      ...quiz,
      uid: accentQuizFormState.uid,
      title: accentQuizFormState.title,
      scores: accentQuizFormState.scores,
      questions: updatedQuestions,
      questionCount: questionCount,
    };
    const updatedQuizzes = state.quizzes.map((item) =>
      item.id !== quizId ? item : updatedQuiz
    );
    const updatedState: State = { ...state, quizzes: updatedQuizzes };
    dispatch({ type: ActionTypes.setState, payload: updatedState });
    await submitQuiz(updatedQuiz);
    navigate(`/quiz/list`);
  };
  return (
    <AccentQuizForm
      state={accentQuizFormState}
      dispatch={accentQuizFormDispatch}
      handleSubmit={handleSubmit}
    />
  );
};

export default AccentQuizPage;
