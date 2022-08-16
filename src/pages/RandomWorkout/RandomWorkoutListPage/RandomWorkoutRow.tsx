import Delete from '@mui/icons-material/Delete';
import Edit from '@mui/icons-material/Edit';
import { Card, IconButton } from '@mui/material';
import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../../../App';
import { INITIAL_USER, RandomWorkout } from '../../../Model';
import { deleteFile } from '../../../repositories/file';
import { deleteRandomWorkout } from '../../../services/randomWorkout';

import { ActionTypes } from '../../../Update';

const RandomWorkoutRow = ({ index }: { index: number }) => {
  const { state, dispatch } = useContext(AppContext);
  const navigate = useNavigate();
  const { randomWorkouts, users } = state;
  const workout = Object.values(randomWorkouts)[index];
  const {
    id,
    title,
    uid,
    targetBpm,
    resultBpm,
    storagePath,
    recordCount,
  }: RandomWorkout = workout;

  const user = users.find((item) => item.id === uid) || INITIAL_USER;

  const openEditPage = () => {
    if (!dispatch) return;
    dispatch({ type: ActionTypes.startFetching });
    navigate(`/random/${id}`);
  };

  const handleDelete = async () => {
    if (!dispatch) return;
    if (window.confirm(`delete?`)) {
      // blob は未実装
      const updatedRandomWorkouts = { ...randomWorkouts };
      delete updatedRandomWorkouts[id];
      dispatch({
        type: ActionTypes.setRandomWorkouts,
        payload: updatedRandomWorkouts,
      });

      if (!!storagePath) {
        await deleteFile(storagePath);
      }
      await deleteRandomWorkout(id);
    }
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
          <div style={{ flexBasis: '80px' }}>{user.displayname}</div>
          <div style={{ flexGrow: 1 }}>{title}</div>
          <div style={{ flexBasis: '80px' }}>{`${resultBpm}|${targetBpm}`}</div>
          <div style={{ flexBasis: '20px' }}>{`${recordCount}`}</div>
          <IconButton size='small' onClick={openEditPage}>
            <Edit />
          </IconButton>
          <IconButton size='small' onClick={handleDelete}>
            <Delete />
          </IconButton>
        </div>
      </div>
    </Card>
  );
};

export default RandomWorkoutRow;
