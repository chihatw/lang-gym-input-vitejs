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
import React, { useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useHandleWorkouts } from '../../../services/useWorkouts';
import { State, Workout } from '../../../Model';
import { Action, ActionTypes } from '../../../Update';
import { getWorkouts } from '../../../services/workout';

const WorkoutsPage = ({
  state,
  dispatch,
}: {
  state: State;
  dispatch: React.Dispatch<Action>;
}) => {
  const { isFetching, workoutList } = state;
  useEffect(() => {
    if (!isFetching) return;
    const fetchData = async () => {
      const _workoutList = workoutList.length
        ? workoutList
        : await getWorkouts();
      dispatch({ type: ActionTypes.setWorkoutList, payload: _workoutList });
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
            {workoutList.map((workout, index) => (
              <WorkoutRow
                key={index}
                workout={workout}
                state={state}
                dispatch={dispatch}
              />
            ))}
          </TableBody>
        </Table>
      </div>
    </Container>
  );
};

export default WorkoutsPage;

const WorkoutRow = ({
  workout,
  state,
  dispatch,
}: {
  state: State;
  dispatch: React.Dispatch<Action>;
  workout: Workout;
}) => {
  const { users } = state;
  const navigate = useNavigate();

  const { deleteWorkout, updateWorkout } = useHandleWorkouts();
  const user = useMemo(
    () => users.filter((user) => user.id === workout.uid)[0],
    [users, workout]
  );

  const handleClickEdit = () => {
    dispatch({ type: ActionTypes.startFetching });
    navigate(`/workout/${workout.id}`);
  };
  const handleClickDelete = () => {
    deleteWorkout(workout.id);
  };
  const handleClickVisibility = () => {
    const newWorkout: Workout = { ...workout, hidden: !workout.hidden };
    updateWorkout(newWorkout);
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
