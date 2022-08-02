import React from 'react';
import { Button, Container } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { auth } from '../../repositories/firebase';
import { State } from '../../Model';
import { Action, ActionTypes } from '../../Update';

const TopPage = ({
  state,
  dispatch,
}: {
  state: State;
  dispatch: React.Dispatch<Action>;
}) => {
  const navigate = useNavigate();
  return (
    <Container maxWidth='sm' sx={{ paddingTop: 2 }}>
      <div style={{ display: 'grid', rowGap: 16 }}>
        <Button
          variant='contained'
          onClick={() => {
            dispatch({ type: ActionTypes.startFetching });
            navigate('article/list');
          }}
        >
          作文一覧
        </Button>
        <Button
          variant='contained'
          onClick={() => {
            navigate('article/input');
          }}
        >
          作文処理
        </Button>
        <Button
          variant='contained'
          onClick={() => {
            dispatch({ type: ActionTypes.startFetching });
            navigate('accentsQuestion/list');
          }}
        >
          問題一覧
        </Button>
        <Button
          variant='contained'
          onClick={() => {
            dispatch({ type: ActionTypes.startFetching });
            navigate('workouts');
          }}
        >
          練習一覧
        </Button>
        <Button
          variant='contained'
          onClick={() => {
            auth.signOut();
          }}
        >
          Sign Out
        </Button>
      </div>
    </Container>
  );
};

export default TopPage;
