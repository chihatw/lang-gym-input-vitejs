import { Container } from '@mui/material';
import { nanoid } from 'nanoid';
import React, { useContext, useEffect, useReducer } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { AppContext } from '../../../App';
import { RandomWorkout } from '../../../Model';
import {
  buildRandomWorkoutFormInitialState,
  setRandomWorkout,
} from '../../../services/randomWorkout';
import { getUsers } from '../../../services/user';
import {
  INITIAL_RANDOM_WORKOUT_FORM_STATE,
  RandomWorkoutFormState,
} from './Model';
import {
  RandomWorkoutFormActionTypes,
  randomWorkoutFormReducer,
} from './Update';
import RandomWorkoutForm from './RandomWorkoutForm';
import { ActionTypes } from '../../../Update';

const RandomWorkoutEdit = () => {
  const { state, dispatch } = useContext(AppContext);
  const { randomWorkouts, users, isFetching } = state;
  const { workoutId } = useParams();
  const navigate = useNavigate();
  const [randomWorkoutFormState, randomWorkoutFormDispatch] = useReducer(
    randomWorkoutFormReducer,
    INITIAL_RANDOM_WORKOUT_FORM_STATE
  );

  useEffect(() => {
    if (!isFetching || !dispatch) return;
    const fetchData = async () => {
      let _users = !!users.length ? users : await getUsers();
      let initialState: RandomWorkoutFormState = {
        ...INITIAL_RANDOM_WORKOUT_FORM_STATE,
        users: _users,
      };
      if (!!workoutId) {
        initialState = buildRandomWorkoutFormInitialState(
          state,
          workoutId,
          _users
        );
      }
      if (!initialState.uid) {
        initialState.uid = _users[0].id;
      }
      randomWorkoutFormDispatch({
        type: RandomWorkoutFormActionTypes.setState,
        payload: initialState,
      });
    };
    fetchData();
  }, [workoutId, isFetching]);

  const submit = async () => {
    if (!dispatch) return;
    const { cues, roundCount } = randomWorkoutFormState;
    const cueIds = cues.map(({ id }) => id);
    let tmpCueIds: string[] = [];

    for (let i = 0; i < roundCount; i++) {
      tmpCueIds = tmpCueIds.concat(cueIds);
    }

    const workout: RandomWorkout = {
      ...randomWorkoutFormState,
      id: workoutId || nanoid(8),
      cueIds: tmpCueIds,
    };

    const updated: { [key: string]: RandomWorkout } = {
      ...randomWorkouts,
      [workout.id]: workout,
    };
    dispatch({ type: ActionTypes.setRandomWorkouts, payload: updated });

    await setRandomWorkout(workout);
    navigate('/random/list');
  };

  return (
    <div style={{ display: 'grid', rowGap: 16, paddingBottom: 120 }}>
      <Container maxWidth='sm' sx={{ paddingTop: 4 }}>
        <RandomWorkoutForm
          state={randomWorkoutFormState}
          submit={submit}
          dispatch={randomWorkoutFormDispatch}
        />
      </Container>
    </div>
  );
};

export default RandomWorkoutEdit;
