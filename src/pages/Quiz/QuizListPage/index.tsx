import { Table, TableBody } from '@mui/material';
import React, { useEffect } from 'react';
import TableLayout from '../../../components/templates/TableLayout';
import { State } from '../../../Model';
import { getQuizList } from '../../../services/quiz';
import { Action, ActionTypes } from '../../../Update';
import QuizRow from './QuizRow';

const QuizListPage = ({
  state,
  dispatch,
}: {
  state: State;
  dispatch: React.Dispatch<Action>;
}) => {
  const { isFetching, quizList } = state;
  useEffect(() => {
    if (!isFetching) return;
    const fetchData = async () => {
      const _quizList = !!quizList.length ? quizList : await getQuizList();
      dispatch({ type: ActionTypes.setQuizList, payload: _quizList });
    };
    fetchData();
  }, [isFetching]);

  return (
    <TableLayout title='問題一覧'>
      <Table>
        <TableBody>
          {quizList.map((_, index) => (
            <QuizRow
              key={index}
              index={index}
              state={state}
              dispatch={dispatch}
            />
          ))}
        </TableBody>
      </Table>
    </TableLayout>
  );
};

export default QuizListPage;
