import Delete from '@mui/icons-material/Delete';
import Edit from '@mui/icons-material/Edit';
import {
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableRow,
} from '@mui/material';
import React from 'react';
import TableLayout from '../../../components/templates/TableLayout';
import { useAccentsQuestionListPage } from './services/accentsQuestionListPage';
import dayjs from 'dayjs';

const AccentsQuestionList = () => {
  const { questionSets, userDisplaynames, onEdit, onDelete } =
    useAccentsQuestionListPage();
  return (
    <TableLayout title='アクセント問題一覧'>
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

export default AccentsQuestionList;
