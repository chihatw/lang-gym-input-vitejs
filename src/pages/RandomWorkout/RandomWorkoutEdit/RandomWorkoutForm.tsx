import * as R from 'ramda';
import { SentencePitchLine } from '@chihatw/pitch-line.sentence-pitch-line';
import {
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Table,
  TableBody,
  TableCell,
  TableRow,
  TextField,
} from '@mui/material';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import string2PitchesArray from 'string2pitches-array';

import { calcBeatCount, cuesStrToCues } from '../../../services/randomWorkout';
import { RandomWorkoutFormState } from './Model';
import {
  RandomWorkoutFormAction,
  RandomWorkoutFormActionTypes,
} from './Update';

const RandomWorkoutForm = ({
  state,
  submit,
  dispatch,
}: {
  state: RandomWorkoutFormState;
  submit: () => void;
  dispatch: React.Dispatch<RandomWorkoutFormAction>;
}) => {
  const navigate = useNavigate();
  const {
    id,
    uid,
    cues,
    title,
    users,
    cuesStr,
    beatCount,
    targetBpm,
    roundCount,
  } = state;
  const handleChangeUid = (uid: string) => {
    dispatch({
      type: RandomWorkoutFormActionTypes.setState,
      payload: { ...state, uid },
    });
  };
  const handleChangeTitle = (title: string) => {
    dispatch({
      type: RandomWorkoutFormActionTypes.setState,
      payload: { ...state, title },
    });
  };
  const handleChangeTargetBpm = (targetBpm: number) => {
    dispatch({
      type: RandomWorkoutFormActionTypes.setState,
      payload: { ...state, targetBpm },
    });
  };
  const handleChangeRoundCount = (roundCount: number) => {
    dispatch({
      type: RandomWorkoutFormActionTypes.setState,
      payload: { ...state, roundCount },
    });
  };
  const handleChangeCuesStr = (cuesStr: string) => {
    const updatedCues = cuesStrToCues(cuesStr, cues);
    const updatedBeatCount = calcBeatCount(updatedCues);
    dispatch({
      type: RandomWorkoutFormActionTypes.setState,
      payload: {
        ...state,
        cues: updatedCues,
        cuesStr,
        beatCount: updatedBeatCount,
      },
    });
  };

  const handleChangeImagePath = (imagePath: string, cueIndex: number) => {
    const updated = R.assocPath<string, RandomWorkoutFormState>(
      ['cues', cueIndex, 'imagePath'],
      imagePath
    )(state);
    dispatch({
      type: RandomWorkoutFormActionTypes.setState,
      payload: updated,
    });
  };

  return (
    <div style={{ display: 'grid', rowGap: 16 }}>
      <h2>{!!id ? `${title} - 更新` : '新規作成'}</h2>
      <div>
        <Button variant='contained' onClick={() => navigate('/random/list')}>
          戻る
        </Button>
      </div>
      <FormControl fullWidth>
        <InputLabel>user</InputLabel>
        <Select
          size='small'
          value={uid}
          variant='standard'
          onChange={(e) => handleChangeUid(e.target.value as string)}
        >
          {users.map((u) => (
            <MenuItem key={u.id} value={u.id}>
              {u.displayname}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <div>{`beatCount: ${beatCount}`}</div>
      <TextField
        size='small'
        fullWidth
        label='title'
        value={title}
        onChange={(e) => handleChangeTitle(e.target.value)}
      />
      <TextField
        size='small'
        fullWidth
        label='targetBpm'
        value={targetBpm}
        type='number'
        onChange={(e) => handleChangeTargetBpm(Number(e.target.value))}
      />
      <TextField
        size='small'
        fullWidth
        label='roundCount'
        value={roundCount}
        type='number'
        onChange={(e) => handleChangeRoundCount(Number(e.target.value))}
      />
      <TextField
        size='small'
        multiline
        rows={10}
        label='cuesStr'
        onChange={(e) => handleChangeCuesStr(e.target.value)}
        value={cuesStr}
      />
      <Table>
        <TableBody>
          {cues.map((cue, cueIndex) => (
            <TableRow key={cue.id}>
              <TableCell>{cue.label}</TableCell>
              <TableCell>
                <SentencePitchLine
                  pitchesArray={string2PitchesArray(cue.pitchStr)}
                />
              </TableCell>
              <TableCell>
                <TextField
                  fullWidth
                  value={cue.imagePath}
                  size='small'
                  variant='standard'
                  onChange={(e) =>
                    handleChangeImagePath(e.target.value, cueIndex)
                  }
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <Button variant='contained' sx={{ color: 'white' }} onClick={submit}>
        {!!id ? `更新` : '新規作成'}
      </Button>
    </div>
  );
};

export default RandomWorkoutForm;
