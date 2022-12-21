import * as R from 'ramda';
import { Container } from '@mui/material';
import { nanoid } from 'nanoid';
import { useContext, useEffect, useReducer, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { AppContext } from '../../../App';
import {
  User,
  State,
  RandomWorkout,
  INITIAL_RANDOM_WORKOUT,
} from '../../../Model';
import {
  cuesToCuesStr,
  getRandomWorkout,
  setRandomWorkout,
} from '../../../services/randomWorkout';
import { getUsers } from '../../../services/user';
import {
  INITIAL_RANDOM_WORKOUT_FORM_STATE,
  RandomWorkoutFormState,
} from './Model';

import RandomWorkoutForm from './RandomWorkoutForm';
import { ActionTypes } from '../../../Update';

const reducer = (
  action: RandomWorkoutFormState,
  payload: RandomWorkoutFormState
) => payload;

const RandomWorkoutEdit = () => {
  const navigate = useNavigate();
  const { workoutId } = useParams();

  const { state, dispatch } = useContext(AppContext);

  const [pageState, pageDispatch] = useReducer(
    reducer,
    INITIAL_RANDOM_WORKOUT_FORM_STATE
  );

  const [users, setUsers] = useState<User[]>([]);
  const [_randomWorkout, _setRandomWorkout] = useState(INITIAL_RANDOM_WORKOUT);

  const [initializing_u, setInitializing_u] = useState(true);
  const [initializing_r, setInitializing_r] = useState(true);

  // users 代入
  useEffect(() => {
    const localUsers = state.users;
    if (!localUsers.length) return;
    setUsers(localUsers);
    console.log('%cset users', 'color:blue');
  }, [state.users]);

  // state.users の更新
  useEffect(() => {
    if (!initializing_u) return;
    const localUsers = state.users;
    if (!!localUsers.length) return;

    const fetchData = async () => {
      const remoteUsers = await getUsers();
      if (!remoteUsers.length) {
        setInitializing_u(false);
        return;
      }

      const updatedState = R.assocPath<User[], State>(
        ['users'],
        remoteUsers
      )(state);
      dispatch({ type: ActionTypes.setState, payload: updatedState });
      console.log('%capp dispatch users', 'color:red');
      setInitializing_u(false);
    };
    fetchData();
  }, [initializing_u, state.users]);

  // randomWorkout 代入
  useEffect(() => {
    if (!users.length) return;

    if (!workoutId) return;
    const localRandomWorkout = state.randomWorkouts[workoutId];
    if (!localRandomWorkout) return;

    if (JSON.stringify(localRandomWorkout) === JSON.stringify(_randomWorkout))
      return;

    _setRandomWorkout({ ...localRandomWorkout });
    console.log('%cset randomWorkout', 'color:blue');
  }, [workoutId, state.randomWorkouts, _randomWorkout, users]);

  // state.randomWorkouts の更新
  useEffect(() => {
    if (!users.length) return;
    if (!initializing_r) return;
    if (!workoutId) return;

    const localRandomWorkout = state.randomWorkouts[workoutId];
    if (!!localRandomWorkout) {
      setInitializing_r(false);
      return;
    }

    const fetchData = async () => {
      const remoteRandomWorkout = await getRandomWorkout(workoutId);
      if (!remoteRandomWorkout.id) {
        setInitializing_r(false);
        return;
      }
      const updatedState = R.assocPath<RandomWorkout, State>(
        ['randomWorkouts', remoteRandomWorkout.id],
        remoteRandomWorkout
      )(state);
      dispatch({ type: ActionTypes.setState, payload: updatedState });
      console.log('%capp dispatch randomWorkouts', 'color:red');
      setInitializing_r(false);
    };
    fetchData();
  }, [workoutId, state.randomWorkouts, initializing_r, users]);

  // pageState 代入
  useEffect(() => {
    if (!users.length) return;

    const initialState = !!_randomWorkout.id
      ? {
          ..._randomWorkout,
          cuesStr: cuesToCuesStr(_randomWorkout.cues),
          uid: _randomWorkout.uid,
        }
      : {
          ..._randomWorkout,
          uid: users[0].id,
          cuesStr: '',
        };
    pageDispatch(initialState);
  }, [users, _randomWorkout]);

  const handleSubmit = async () => {
    const cueIds = pageState.cues.map(({ id }) => id);
    let tmpCueIds: string[] = [];

    for (let i = 0; i < pageState.roundCount; i++) {
      tmpCueIds = tmpCueIds.concat(cueIds);
    }

    const workout: RandomWorkout = {
      ...pageState,
      id: workoutId || nanoid(8),
      cueIds: tmpCueIds,
    };

    const updatedState = R.assocPath<RandomWorkout, State>(
      ['randomWorkouts', workout.id],
      workout
    )(state);

    dispatch({ type: ActionTypes.setState, payload: updatedState });

    await setRandomWorkout(workout);
    navigate('/random/list');
  };

  if (!users.length) return <></>;

  return (
    <div style={{ display: 'grid', rowGap: 16, paddingBottom: 120 }}>
      <Container maxWidth='sm' sx={{ paddingTop: 4 }}>
        <RandomWorkoutForm
          users={users}
          pageState={pageState}
          pageDispatch={pageDispatch}
          handleSubmit={handleSubmit}
        />
      </Container>
    </div>
  );
};

export default RandomWorkoutEdit;
