import * as R from 'ramda';
import { Table, TableBody } from '@mui/material';
import React, { useContext, useEffect, useState } from 'react';
import { AppContext } from '../../../App';
import TableLayout from '../../../components/templates/TableLayout';
import { getQuizzes } from '../../../services/quiz';
import { ActionTypes } from '../../../Update';
import QuizRow from './QuizRow';
import { State, Quiz } from '../../../Model';

const QuizListPage = () => {
  const { state, dispatch } = useContext(AppContext);
  const [initializing, setInitializing] = useState(true);

  useEffect(() => {
    if (!state.users.length) return;
    const fetchData = async () => {
      const quizzes: { [id: string]: Quiz } =
        Object.keys(state.quizzes).length > 1
          ? state.quizzes
          : initializing
          ? await getQuizzes()
          : {};
      const updatedState = R.compose(
        R.assocPath<boolean, State>(['isFetching'], false),
        R.assocPath<{ [id: string]: Quiz }, State>(['quizzes'], quizzes)
      )(state);
      dispatch({ type: ActionTypes.setState, payload: updatedState });
      setInitializing(false);
    };
    fetchData();
  }, [state.users]);

  return (
    <TableLayout title='問題一覧'>
      <Table>
        <TableBody>
          {Object.values(state.quizzes)
            .sort((a, b) => b.createdAt - a.createdAt)
            .map((quiz, index) => (
              <QuizRow key={index} quiz={quiz} />
            ))}
        </TableBody>
      </Table>
    </TableLayout>
  );
};

export default QuizListPage;
