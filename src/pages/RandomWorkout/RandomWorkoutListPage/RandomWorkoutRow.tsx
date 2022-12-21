import Delete from '@mui/icons-material/Delete';
import { Button, IconButton } from '@mui/material';
import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../../../App';
import { RandomWorkout } from '../../../Model';
import { deleteFile } from '../../../repositories/file';
import { deleteRandomWorkout } from '../../../services/randomWorkout';

import { ActionTypes } from '../../../Update';

const RandomWorkoutRow = ({
  randomWorkout,
}: {
  randomWorkout: RandomWorkout;
}) => {
  const { state, dispatch } = useContext(AppContext);
  const navigate = useNavigate();

  const handleCLickEditLink = () => {
    navigate(`/random/${randomWorkout.id}`);
  };

  const handleDelete = async () => {
    if (!dispatch) return;
    if (window.confirm(`delete?`)) {
      // blob は未実装
      const updatedRandomWorkouts = { ...state.randomWorkouts };
      delete updatedRandomWorkouts[randomWorkout.id];
      dispatch({
        type: ActionTypes.setRandomWorkouts,
        payload: updatedRandomWorkouts,
      });

      if (!!randomWorkout.storagePath) {
        await deleteFile(randomWorkout.storagePath);
      }
      await deleteRandomWorkout(randomWorkout.id);
    }
  };
  return (
    <div
      style={{
        color: '#555',
        display: 'grid',
        fontSize: 12,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', columnGap: 8 }}>
        <Button
          onClick={handleCLickEditLink}
          sx={{
            padding: '0 0 0 20px',
            minWidth: 0,
            flexGrow: 1,
            justifyContent: 'flex-start',
            color: '#555',
            height: '100%',
            textTransform: 'none',
          }}
        >
          <div
            style={{
              display: 'flex',
              flexWrap: 'nowrap',
              flexGrow: 1,
              columnGap: 8,
            }}
          >
            <div
              style={{
                flexGrow: 1,
                textAlign: 'left',
              }}
            >
              {randomWorkout.title}
            </div>
            <div
              style={{
                textAlign: 'right',
              }}
            >
              {`x${randomWorkout.roundCount}`}
            </div>
            <div
              style={{
                flexBasis: '40px',
                textAlign: 'right',
              }}
            >{`${randomWorkout.resultBpm}|${randomWorkout.targetBpm}`}</div>
            <div
              style={{
                flexBasis: '20px',
                textAlign: 'right',
              }}
            >{`${randomWorkout.recordCount}`}</div>
          </div>
        </Button>

        <IconButton size='small' onClick={handleDelete}>
          <Delete />
        </IconButton>
      </div>
    </div>
  );
};

export default RandomWorkoutRow;
