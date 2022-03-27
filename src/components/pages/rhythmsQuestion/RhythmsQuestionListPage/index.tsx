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
import TableLayout from '../../../templates/TableLayout';
import dayjs from 'dayjs';

const RhythmsQuestionListPage = () => {
  const { questionSets, userDisplaynames, onEdit, onDelete } =
    useRhythmsQuestionListPage();
  return (
    <TableLayout title='リズム問題一覧'>
      <Table>
        <TableBody>
          {questionSets.map((questionSet) => (
            <TableRow key={questionSet.id}>
              <TableCell>{userDisplaynames[questionSet.uid]}</TableCell>
              <TableCell>{questionSet.title}</TableCell>
              <TableCell>
                {dayjs(questionSet.createdAt).format('YYYY年M月D日')}
              </TableCell>
              <TableCell padding='none'>
                <IconButton size='small' onClick={() => onEdit(questionSet)}>
                  <Edit />
                </IconButton>
              </TableCell>
              <TableCell padding='none'>
                <IconButton size='small' onClick={() => onDelete(questionSet)}>
                  <Delete />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableLayout>
  );
};

export default RhythmsQuestionListPage;
