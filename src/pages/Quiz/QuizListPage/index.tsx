import { Table, TableBody } from '@mui/material';
import React, { useContext, useEffect } from 'react';
import { AppContext } from '../../../App';
import TableLayout from '../../../components/templates/TableLayout';
import { getQuizList } from '../../../services/quiz';
import { ActionTypes } from '../../../Update';
import QuizRow from './QuizRow';

const QuizListPage = () => {
  const { state, dispatch } = useContext(AppContext);
  const { isFetching, quizList } = state;
  useEffect(() => {
    if (!isFetching || !dispatch) return;
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
            <QuizRow key={index} index={index} />
          ))}
        </TableBody>
      </Table>
    </TableLayout>
  );
};

export default QuizListPage;
