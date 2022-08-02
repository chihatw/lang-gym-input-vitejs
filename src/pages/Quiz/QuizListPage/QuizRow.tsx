import CheckIcon from '@mui/icons-material/Check';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { IconButton, TableCell, TableRow } from '@mui/material';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { QuestionSet, State } from '../../../Model';
import { deleteQuiz } from '../../../services/quiz';
import { Action, ActionTypes } from '../../../Update';

const QuizRow = ({
  state,
  index,
  dispatch,
}: {
  state: State;
  index: number;
  dispatch: React.Dispatch<Action>;
}) => {
  const navigate = useNavigate();
  const { quizList } = state;
  const questionSet = quizList[index];
  const { userDisplayname, title, answered, type, id, questionGroups } =
    questionSet;

  const handleOpenEditPage = () => {
    dispatch({ type: ActionTypes.startFetching });
    switch (type) {
      case 'articleAccents':
        navigate(`/accentsQuestion/${id}`);
        return;
      case 'articleRhythms':
        navigate(`/rhythmsQuestion/${id}`);
        return;
      default:
    }
  };

  const handleDelete = () => {
    dispatch({ type: ActionTypes.deleteQuiz, payload: id });
    deleteQuiz(id, questionGroups[0]);
  };

  return (
    <TableRow>
      <TableCell>
        <span style={{ whiteSpace: 'nowrap' }}>{userDisplayname}</span>
      </TableCell>
      <TableCell>{title}</TableCell>
      <TableCell>{answered && <CheckIcon />}</TableCell>
      <TableCell padding='none'>
        <IconButton size='small' onClick={handleOpenEditPage}>
          <EditIcon />
        </IconButton>
      </TableCell>

      <TableCell padding='none'>
        <IconButton size='small' onClick={handleDelete}>
          <DeleteIcon />
        </IconButton>
      </TableCell>
    </TableRow>
  );
};

export default QuizRow;
