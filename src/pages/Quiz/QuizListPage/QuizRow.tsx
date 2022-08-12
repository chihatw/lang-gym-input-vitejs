import CheckIcon from '@mui/icons-material/Check';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { IconButton, TableCell, TableRow } from '@mui/material';
import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../../../App';
import { deleteQuiz } from '../../../services/quiz';
import { ActionTypes } from '../../../Update';

const QuizRow = ({ index }: { index: number }) => {
  const { state, dispatch } = useContext(AppContext);
  const navigate = useNavigate();
  const { quizList } = state;
  const questionSet = quizList[index];
  const { userDisplayname, title, answered, type, id, questionGroups } =
    questionSet;

  const handleOpenEditPage = () => {
    if (!dispatch) return;
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
    if (!dispatch) return;
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
