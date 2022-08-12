import DeleteIcon from '@mui/icons-material/Delete';

import VisibilityOffOutlinedIcon from '@mui/icons-material/VisibilityOffOutlined';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import EditIcon from '@mui/icons-material/Edit';
import {
  Button,
  Container,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableRow,
} from '@mui/material';
import React, { useContext, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { State, Workout } from '../../../Model';
import { Action, ActionTypes } from '../../../Update';
import {
  deleteWorkout,
  getWorkouts,
  setWorkout,
} from '../../../services/workout';
import { getUsers } from '../../../services/user';
import { AppContext } from '../../../App';

const WorkoutsPage = () => {
  const { state, dispatch } = useContext(AppContext);
  const { isFetching, workoutList, users } = state;
  useEffect(() => {
    if (!isFetching || !dispatch) return;
    const fetchData = async () => {
      let _users = !!users.length ? users : await getUsers();
      const _workoutList = workoutList.length
        ? workoutList
        : await getWorkouts();
      dispatch({
        type: ActionTypes.setWorkoutList,
        payload: { workoutList: _workoutList, users: _users },
      });
    };
    fetchData();
  }, [isFetching]);
  const navigate = useNavigate();

  const handleClickCreate = () => {
    navigate('/workout');
  };

  return (
    <Container sx={{ paddingTop: 5 }} maxWidth='sm'>
      <div style={{ display: 'grid', rowGap: 8 }}>
        <h1>Workouts</h1>
        <div>
          <Button onClick={() => navigate('/')}>戻る</Button>
        </div>
        <div>
          <Button variant='contained' onClick={handleClickCreate}>
            新規作成
          </Button>
        </div>
        <Table size='small'>
          <TableBody>
            {workoutList.map((_, index) => (
              <WorkoutRow key={index} workoutIndex={index} />
            ))}
          </TableBody>
        </Table>
      </div>
    </Container>
  );
};

export default WorkoutsPage;

const WorkoutRow = ({ workoutIndex }: { workoutIndex: number }) => {
  const { state, dispatch } = useContext(AppContext);
  const { users, workoutList } = state;
  const workout = workoutList[workoutIndex];
  const { id: workoutId } = workout;
  const navigate = useNavigate();

  const user = useMemo(
    () => users.filter((user) => user.id === workout.uid)[0],
    [users, workout]
  );

  const handleClickEdit = () => {
    if (!dispatch) return;
    dispatch({ type: ActionTypes.startFetching });
    navigate(`/workout/${workoutId}`);
  };
  const handleClickDelete = () => {
    if (!dispatch) return;
    dispatch({ type: ActionTypes.deleteWorkout, payload: workoutId });
    deleteWorkout(workoutId);
  };
  const handleClickVisibility = () => {
    if (!dispatch) return;
    const newWorkout: Workout = { ...workout, hidden: !workout.hidden };
    dispatch({ type: ActionTypes.setWorkoutSingle, payload: newWorkout });
    setWorkout(newWorkout);
  };
  return (
    <TableRow>
      <TableCell>{user?.displayname || ''}</TableCell>
      <TableCell>{workout.label}</TableCell>
      <TableCell>{workout.beatCount}</TableCell>
      <TableCell>
        <IconButton onClick={handleClickEdit}>
          <EditIcon />
        </IconButton>
      </TableCell>
      <TableCell>
        <IconButton onClick={handleClickVisibility}>
          {workout.hidden ? (
            <VisibilityOffOutlinedIcon />
          ) : (
            <VisibilityOutlinedIcon />
          )}
        </IconButton>
      </TableCell>
      <TableCell>
        <IconButton onClick={handleClickDelete}>
          <DeleteIcon />
        </IconButton>
      </TableCell>
    </TableRow>
  );
};
