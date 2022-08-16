import { Button, Container, Typography } from '@mui/material';
import React, { useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../../../App';
import LinkButton from '../../../components/ui/LinkButton';
import { getRandomWorkouts } from '../../../services/randomWorkout';
import { ActionTypes } from '../../../Update';
import RandomWorkoutRow from './RandomWorkoutRow';

const RandomWorkoutListPage = () => {
  const { state, dispatch } = useContext(AppContext);
  const navigate = useNavigate();
  const { isFetching, randomWorkouts } = state;
  useEffect(() => {
    if (!isFetching || !dispatch) return;
    const fetchData = async () => {
      const _randomWorkouts = Object.keys(randomWorkouts).length
        ? randomWorkouts
        : await getRandomWorkouts();
      dispatch({
        type: ActionTypes.setRandomWorkouts,
        payload: _randomWorkouts,
      });
    };
    fetchData();
  }, [isFetching]);

  const openEditPage = () => {
    if (!dispatch) return;
    dispatch({ type: ActionTypes.startFetching });
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
        {Object.values(randomWorkouts).map((_, index) => (
          <RandomWorkoutRow key={index} index={index} />
        ))}
      </div>
    </Container>
  );
};

export default RandomWorkoutListPage;
