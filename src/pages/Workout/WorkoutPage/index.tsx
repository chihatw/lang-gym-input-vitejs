import { useNavigate, useParams } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import { Button, Container, MenuItem, Select, TextField } from '@mui/material';

import WorkoutItemRow from './components/WorkoutItemRow';
import {
  calcBeatCount,
  string2WorkoutItems,
  WorkoutItem,
  workoutItems2String,
} from 'workout-items';
import { INITIAL_WORKOUT, State, Workout } from '../../../Model';
import { Action, ActionTypes } from '../../../Update';
import { getUsers } from '../../../services/user';
import { getWorkout, setWorkout } from '../../../services/workout';
import { nanoid } from 'nanoid';

const WorkoutPage = ({
  state,
  dispatch,
}: {
  state: State;
  dispatch: React.Dispatch<Action>;
}) => {
  const { workoutId } = useParams();
  const { users, isFetching, workout, memo } = state;
  const { workouts } = memo;

  useEffect(() => {
    if (!isFetching || !workoutId) return;

    const fetchData = async () => {
      let _users = users.length ? users : await getUsers();

      let _workout = INITIAL_WORKOUT;
      if (workout.id === workoutId) {
        _workout = workout;
      } else {
        const memoWorkout = workouts[workoutId];
        if (memoWorkout) {
          _workout = memoWorkout;
        } else {
          _workout = await getWorkout(workoutId);
        }
      }
      dispatch({
        type: ActionTypes.setWorkout,
        payload: { users: _users, workout: _workout },
      });
    };
    fetchData();
  }, [isFetching]);

  const navigate = useNavigate();

  const [label, setLabel] = useState('');
  const [uid, setUid] = useState('');
  const [workoutItems, setWorkoutItems] = useState<WorkoutItem[]>([]);
  const [workoutItemsStr, setWorkoutItemsStr] = useState('');
  const [beatCount, setBeatCount] = useState(0);
  const [dateId, setDateId] = useState('');

  useEffect(() => {
    if (!!uid || !users.length) return;
    setUid(users[0]?.id);
  }, [users]);

  useEffect(() => {
    if (!workoutId) return;
    setLabel(workout.label);
    setUid(workout.uid);
    setBeatCount(workout.beatCount);
    setDateId(workout.dateId);
    setWorkoutItems(workout.items);
    setWorkoutItemsStr(workoutItems2String(workout.items));
  }, [workout]);

  const handleChangeWorkoutItemsStr = (value: string) => {
    setWorkoutItemsStr(value);
    const workoutItems = string2WorkoutItems(value);
    setWorkoutItems(workoutItems);
    setBeatCount(calcBeatCount(workoutItems));
  };

  const handleSubmit = async () => {
    const date = new Date();
    const newWorkout: Workout = {
      id: workoutId || nanoid(8),
      beatCount,
      createdAt: !!workout.createdAt ? workout.createdAt : date.getTime(),
      createdAtStr: '',
      dateId,
      hidden: typeof workout.hidden === 'boolean' ? workout.hidden : true,
      items: workoutItems,
      label,
      uid,
    };

    dispatch({ type: ActionTypes.setWorkoutSingle, payload: newWorkout });
    setWorkout(newWorkout);

    navigate('/workouts');
  };

  return (
    <Container maxWidth='sm' sx={{ paddingTop: 5, paddingBottom: 10 }}>
      <div style={{ display: 'grid', rowGap: 8 }}>
        <h1>Workout</h1>
        <div>
          <Button onClick={() => navigate('/workouts')}>戻る</Button>
        </div>
        {!!workout.createdAtStr && (
          <div
            style={{ color: '#aaa', fontSize: 12 }}
          >{`created at: ${workout.createdAtStr}`}</div>
        )}
        <TextField
          value={label}
          size='small'
          label='label'
          onChange={(e) => setLabel(e.target.value)}
        />
        <Select value={uid} onChange={(e) => setUid(e.target.value)}>
          {users.map((user, index) => (
            <MenuItem key={index} value={user.id}>
              {user.displayname}
            </MenuItem>
          ))}
        </Select>
        <TextField
          value={dateId}
          size='small'
          label='dateId'
          onChange={(e) => setDateId(e.target.value)}
        />
        <TextField
          value={beatCount}
          size='small'
          label='beatCount'
          type='number'
          onChange={(e) => setBeatCount(Number(e.target.value))}
        />
        <TextField
          multiline
          label='workoutItemsStr'
          value={workoutItemsStr}
          onChange={(e) => handleChangeWorkoutItemsStr(e.target.value)}
        />
        {workoutItems.map((workoutItem, index) => (
          <WorkoutItemRow key={index} index={index} workoutItem={workoutItem} />
        ))}
        <div style={{ height: 40 }} />
        <Button variant='contained' onClick={handleSubmit}>
          {!!workout.id ? '更新' : '作成'}
        </Button>
      </div>
    </Container>
  );
};

export default WorkoutPage;
