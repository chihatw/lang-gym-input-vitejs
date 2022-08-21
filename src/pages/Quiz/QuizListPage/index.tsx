import * as R from 'ramda';
import { Table, TableBody } from '@mui/material';
import React, { useContext, useEffect } from 'react';
import { AppContext } from '../../../App';
import TableLayout from '../../../components/templates/TableLayout';
import { getQuizList } from '../../../services/quiz';
import { ActionTypes } from '../../../Update';
import QuizRow from './QuizRow';
import { State, Quiz } from '../../../Model';

const QuizListPage = () => {
  const { state, dispatch } = useContext(AppContext);

  useEffect(() => {
    if (!state.isFetching || !dispatch) return;
    const fetchData = async () => {
      const _quizzes: Quiz[] = !!state.quizzes.length
        ? state.quizzes
        : await getQuizList();
      const updatedState = R.compose(
        R.assocPath<boolean, State>(['isFetching'], false),
        R.assocPath<Quiz[], State>(['quizzes'], _quizzes)
      )(state);
      dispatch({ type: ActionTypes.setState, payload: updatedState });
    };
    fetchData();
  }, [state.isFetching, state.quizzes]);

  return (
    <TableLayout title='問題一覧'>
      <Table>
        <TableBody>
          {state.quizzes.map((_, index) => (
            <QuizRow key={index} index={index} />
          ))}
        </TableBody>
      </Table>
    </TableLayout>
  );
};

export default QuizListPage;
