import Delete from '@mui/icons-material/Delete';
import Edit from '@mui/icons-material/Edit';
import { Button, Card, Container, IconButton, Typography } from '@mui/material';
import React, { useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../../../App';
import LinkButton from '../../../components/ui/LinkButton';
import { getRandomWorkouts } from '../../../services/randomWorkout';
import { ActionTypes } from '../../../Update';

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
    <Container maxWidth='sm' sx={{ paddingTop: 2 }}>
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
          <WorkoutRow key={index} index={index} />
        ))}
      </div>
    </Container>
  );
};

export default RandomWorkoutListPage;

const WorkoutRow = ({ index }: { index: number }) => {
  const { state, dispatch } = useContext(AppContext);
  const navigate = useNavigate();
  const { randomWorkouts } = state;
  const workout = Object.values(randomWorkouts)[index];
  const { id, title, storagePath } = workout;

  const openEditPage = () => {
    if (!dispatch) return;
    dispatch({ type: ActionTypes.startFetching });
    navigate(`/random/${id}`);
  };
  return (
    <Card>
      <div
        style={{
          color: '#555',
          rowGap: 16,
          padding: 16,
          display: 'grid',
          fontSize: 12,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <span style={{ flexGrow: 1 }}>{title}</span>
          <IconButton size='small' onClick={() => openEditPage()}>
            <Edit />
          </IconButton>
          <IconButton size='small'>
            <Delete />
          </IconButton>
        </div>
      </div>
    </Card>
  );
};
