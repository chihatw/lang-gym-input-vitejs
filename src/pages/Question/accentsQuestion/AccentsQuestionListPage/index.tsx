import { Table, TableBody } from '@mui/material';
import React from 'react';
import TableLayout from '../../../../components/templates/TableLayout';
import { State } from '../../../../Model';
import { Action } from '../../../../Update';
import QuestionSetRow from '../../components/QuestionSetRow';
import { useAccentsQuestionListPage } from './services/accentsQuestionListPage';

const AccentsQuestionList = ({
  state,
  dispatch,
}: {
  state: State;
  dispatch: React.Dispatch<Action>;
}) => {
  const { questionSets, onEdit, onDelete } = useAccentsQuestionListPage();
  return (
    <TableLayout title='アクセント問題一覧'>
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

export default AccentsQuestionList;
