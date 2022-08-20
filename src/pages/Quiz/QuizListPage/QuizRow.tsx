import CheckIcon from '@mui/icons-material/Check';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { IconButton, TableCell, TableRow } from '@mui/material';
import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../../../App';
import { INITIAL_USER } from '../../../Model';
import { deleteQuiz } from '../../../services/quiz';
import { ActionTypes } from '../../../Update';

const QuizRow = ({ index }: { index: number }) => {
  const { state, dispatch } = useContext(AppContext);
  const navigate = useNavigate();
  const { quizzes } = state;
  const quiz = quizzes[index];

  const { uid, title, scores, type, id } = quiz;

  const handleOpenEditPage = () => {
    switch (type) {
      case 'articleAccents':
        navigate(`/quiz/accent/${id}`);
        return;
      case 'articleRhythms':
        navigate(`/quiz/rhythm/${id}`);
        return;
      default:
    }
  };

  const handleDelete = () => {
    if (!dispatch) return;
    dispatch({ type: ActionTypes.deleteQuiz, payload: id });
    deleteQuiz(id);
  };

  const user = state.users.find((item) => item.id === uid) || INITIAL_USER;

  return (
    <TableRow>
      <TableCell>
        <span style={{ whiteSpace: 'nowrap' }}>{user.displayname}</span>
      </TableCell>
      <TableCell>{title}</TableCell>
      <TableCell>{!!Object.keys(scores).length && <CheckIcon />}</TableCell>
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
