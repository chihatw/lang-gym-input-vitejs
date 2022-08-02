import { useNavigate, useParams } from 'react-router-dom';
import React, { useEffect, useReducer } from 'react';
import { INITIAL_QUESTION_SET, Question, State } from '../../../Model';
import { Action, ActionTypes } from '../../../Update';
import { getUsers } from '../../../services/user';
import {
  getQuiz,
  submitQuiz,
  buildRhythmInitialValues,
  buildQuizFromRhythmQuizState,
} from '../../../services/quiz';
import { RhythmQuizActionTypes, rhythmQuizReducer } from './Update';
import { INITIAL_RHYTHM_QUIZ_STATE } from './Model';
import RhythmQuizForm from './RhythmQuizForm';

const RhythmQuizPage = ({
  state,
  dispatch,
}: {
  state: State;
  dispatch: React.Dispatch<Action>;
}) => {
  const navigate = useNavigate();
  const { questionSetId } = useParams();
  const { isFetching, memo, users } = state;
  useEffect(() => {
    if (!isFetching) return;

    const fetchData = async () => {
      let _users = !!users.length ? users : await getUsers();
      if (!questionSetId) {
        dispatch({
          type: ActionTypes.setQuiz,
          payload: {
            quiz: INITIAL_QUESTION_SET,
            users: _users,
            questions: [],
            quizBlob: null,
          },
        });
        return;
      }
      let _quiz = INITIAL_QUESTION_SET;
      let _questions: Question[] = [];
      let _quizBlob: Blob | null = null;

      const memoQuiz = memo.quizzes[questionSetId];
      const memoQuestions = memo.questions[questionSetId];
      const memoQuizBlob = memo.quizBlobs[questionSetId];
      if (memoQuiz && memoQuestions && memoQuizBlob !== undefined) {
        _quiz = memoQuiz;
        _questions = memoQuestions;
        _quizBlob = memoQuizBlob;
      } else {
        const { quiz, questions, quizBlob } = await getQuiz(questionSetId);
        _quiz = quiz;
        _questions = questions;
        _quizBlob = quizBlob;
      }

      dispatch({
        type: ActionTypes.setQuiz,
        payload: {
          quiz: _quiz,
          users: _users,
          quizBlob: _quizBlob,
          questions: _questions,
        },
      });
    };
    fetchData();
  }, [isFetching]);

  const [rhythmQuizState, rhythmQuizDispatch] = useReducer(
    rhythmQuizReducer,
    INITIAL_RHYTHM_QUIZ_STATE
  );

  useEffect(() => {
    const { quiz, quizBlob, audioContext, questions } = state;
    const { title, uid, answered, questionCount } = quiz;
    const { audios, disabledsArray, rhythmArray, rhythmString } =
      buildRhythmInitialValues(questions);
    rhythmQuizDispatch({
      type: RhythmQuizActionTypes.initialize,
      payload: {
        uid,
        users,
        title,
        audios,
        quizBlob,
        answered,
        rhythmArray,
        rhythmString,
        audioContext,
        disabledsArray,
        questionCount,
      },
    });
  }, [state]);

  const onSubmit = async () => {
    const { quiz, questions, questionIdsToDelete } =
      buildQuizFromRhythmQuizState(state, rhythmQuizState);

    dispatch({
      type: ActionTypes.submitQuiz,
      payload: { quiz, questions },
    });
    await submitQuiz(quiz, questions, questionIdsToDelete);

    navigate(`/accentsQuestion/list`);
  };

  return (
    <RhythmQuizForm
      state={rhythmQuizState}
      dispatch={rhythmQuizDispatch}
      onSubmit={onSubmit}
    />
  );
};

export default RhythmQuizPage;
