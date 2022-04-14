import { Check } from '@mui/icons-material';
import Delete from '@mui/icons-material/Delete';
import Edit from '@mui/icons-material/Edit';
import { IconButton, TableCell, TableRow } from '@mui/material';
import React, { useContext, useMemo } from 'react';
import { AppContext } from '../../../services/app';
import { QuestionSet } from '../../../services/useQuestionSets';

const QuestionSetRow = ({
  questionSet,
  onEdit,
  onDelete,
}: {
  questionSet: QuestionSet;
  onEdit: (q: QuestionSet) => void;
  onDelete: () => void;
}) => {
  const { users } = useContext(AppContext);
  const displayname = useMemo(() => {
    const { uid } = questionSet;
    const user = users.filter((user) => user.id === uid)[0];
    return user?.displayname || '';
  }, [users, questionSet]);
  return (
    <TableRow>
      <TableCell>
        <span style={{ whiteSpace: 'nowrap' }}>{displayname}</span>
      </TableCell>
      <TableCell>{questionSet.title}</TableCell>
      <TableCell>{questionSet.answered && <Check />}</TableCell>
      <TableCell padding='none'>
        <IconButton size='small' onClick={() => onEdit(questionSet)}>
          <Edit />
        </IconButton>
      </TableCell>

      <TableCell padding='none'>
        <IconButton size='small' onClick={onDelete}>
          <Delete />
        </IconButton>
      </TableCell>
    </TableRow>
  );
};

export default QuestionSetRow;
