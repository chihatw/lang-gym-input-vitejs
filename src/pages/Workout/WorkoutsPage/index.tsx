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
import React, { useContext, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../../../services/app';
import { useHandleWorkouts, Workout } from '../../../services/useWorkouts';

const WorkoutsPage = () => {
  const navigate = useNavigate();
  const { workouts, setWorkoutId } = useContext(AppContext);

  const handleClickCreate = () => {
    setWorkoutId('');
    setTimeout(() => {
      navigate('/workout');
    }, 150);
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
            {workouts.map((workout, index) => (
              <WorkoutRow key={index} workout={workout} />
            ))}
          </TableBody>
        </Table>
      </div>
    </Container>
  );
};

export default WorkoutsPage;

const WorkoutRow = ({ workout }: { workout: Workout }) => {
  const navigate = useNavigate();
  const { users, setWorkoutId } = useContext(AppContext);
  const { deleteWorkout, updateWorkout } = useHandleWorkouts();
  const user = useMemo(
    () => users.filter((user) => user.id === workout.uid)[0],
    [users, workout]
  );

  const handleClickEdit = () => {
    setWorkoutId(workout.id);
    navigate('/workout');
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
