import * as R from 'ramda';
import { Button, Container, Typography } from '@mui/material';
import { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../../../App';
import LinkButton from '../../../components/ui/LinkButton';
import { RandomWorkout, State } from '../../../Model';
import { getRandomWorkouts } from '../../../services/randomWorkout';
import { ActionTypes } from '../../../Update';
import RandomWorkoutRow from './RandomWorkoutRow';

const RandomWorkoutListPage = () => {
  const { state, dispatch } = useContext(AppContext);
  const navigate = useNavigate();
  const [initializing, setInitializing] = useState(true);
  const [randomWorkouts, setRandomWorkouts] = useState<{
    [id: string]: RandomWorkout;
  }>({});

  // 代入
  useEffect(() => {
    const localRandomWorkouts = { ...state.randomWorkouts };
    if (!Object.keys(localRandomWorkouts).length) return;

    const ordered = Object.values(randomWorkouts).sort(
      (a, b) => b.createdAt - a.createdAt
    );
    const ordered_l = Object.values(localRandomWorkouts).sort(
      (a, b) => b.createdAt - a.createdAt
    );

    if (JSON.stringify(ordered) === JSON.stringify(ordered_l)) return;
    console.log('%cset random workouts', 'color:blue');
    setRandomWorkouts(localRandomWorkouts);
    // なぜか、この処理の後、state.randomWorkouts が {} 空になる　2023-02-03
    // 原因がわからないので、touch の時の setAudioContext を削除してみた
  }, [state.randomWorkouts, randomWorkouts, initializing]);

  // state.randomWorkouts の更新
  useEffect(() => {
    if (!initializing) return;

    // 毎回 fetch しているので、localを無視
    // const localRandomWorkouts = { ...state.randomWorkouts };
    // if (!!Object.keys(localRandomWorkouts).length) return;

    const fetchData = async () => {
      const remoteRandomWorkouts = await getRandomWorkouts();
      if (!Object.keys(remoteRandomWorkouts)) {
        setInitializing(false);
        return;
      }

      const ordered = Object.values(randomWorkouts).sort(
        (a, b) => b.createdAt - a.createdAt
      );
      const ordered_r = Object.values(remoteRandomWorkouts).sort(
        (a, b) => b.createdAt - a.createdAt
      );

      if (JSON.stringify(ordered) === JSON.stringify(ordered_r)) {
        setInitializing(false);
        return;
      }
      const updatedState = R.assocPath<{ [id: string]: RandomWorkout }, State>(
        ['randomWorkouts'],
        remoteRandomWorkouts
      )(state);
      console.log('%cdispatch app random workouts', 'color:red');

      dispatch({
        type: ActionTypes.setState,
        payload: updatedState,
      });
      setInitializing(false);
    };
    fetchData();
  }, [state.randomWorkouts, initializing, randomWorkouts]);

  const openEditPage = () => {
    navigate(`/random/new`);
  };

  return (
    <Container maxWidth='sm' sx={{ paddingTop: 2, paddingBottom: 30 }}>
      <div style={{ display: 'grid', rowGap: 16 }}>
        <Typography variant='h5'>{' ランダム問題一覧'}</Typography>
        <div>
          <LinkButton label={'戻る'} pathname={'/'} />
        </div>
        <div>
          <Button variant='contained' onClick={() => openEditPage()}>
            新規作成
          </Button>
        </div>
        <div>
          {Object.values(randomWorkouts)
            .sort((a, b) => b.createdAt - a.createdAt)
            .map((randamWorkout, index) => (
              <RandomWorkoutRow key={index} randomWorkout={randamWorkout} />
            ))}
        </div>
      </div>
    </Container>
  );
};

export default RandomWorkoutListPage;
