import {
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableRow,
} from '@mui/material';
import Delete from '@mui/icons-material/Delete';
import Edit from '@mui/icons-material/Edit';
import React from 'react';
import { useRhythmsQuestionListPage } from './services/rhythmsQuestionListPage';
import TableLayout from '../../../../components/templates/TableLayout';
import dayjs from 'dayjs';
import QuestionSetRow from '../../components/QuestionSetRow';

const RhythmsQuestionListPage = () => {
  const { questionSets, userDisplaynames, onEdit, onDelete } =
    useRhythmsQuestionListPage();
  return (
    <TableLayout title='リズム問題一覧'>
      <Table>
        <TableBody>
          {questionSets.map((questionSet, index) => (
            <QuestionSetRow
              onDelete={onDelete}
              onEdit={onEdit}
              questionSet={questionSet}
              key={index}
            />
          ))}
        </TableBody>
      </Table>
    </TableLayout>
  );
};

export default RhythmsQuestionListPage;
