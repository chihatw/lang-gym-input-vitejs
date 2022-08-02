import { Table, TableBody } from '@mui/material';

import React from 'react';
import { useRhythmsQuestionListPage } from './services/rhythmsQuestionListPage';
import TableLayout from '../../../../components/templates/TableLayout';
import QuestionSetRow from '../../components/QuestionSetRow';
import { State } from '../../../../Model';
import { Action } from '../../../../Update';

const RhythmsQuestionListPage = ({
  state,
  dispatch,
}: {
  state: State;
  dispatch: React.Dispatch<Action>;
}) => {
  const { questionSets, onEdit, onDelete } = useRhythmsQuestionListPage();
  return (
    <TableLayout title='リズム問題一覧'>
      <Table>
        <TableBody>
          {questionSets.map((questionSet, index) => (
            <QuestionSetRow
              onDelete={() => onDelete(questionSet)}
              onEdit={onEdit}
              questionSet={questionSet}
              key={index}
              state={state}
              dispatch={dispatch}
            />
          ))}
        </TableBody>
      </Table>
    </TableLayout>
  );
};

export default RhythmsQuestionListPage;
