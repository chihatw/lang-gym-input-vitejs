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
  const handleChengeRecordCount = (recordCount: number) => {
    recordCount = Math.max(0, recordCount);
    dispatch({
      type: RandomWorkoutFormActionTypes.setState,
      payload: { ...state, recordCount },
    });
  };
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
    targetBpm = Math.max(0, targetBpm);
    dispatch({
      type: RandomWorkoutFormActionTypes.setState,
      payload: { ...state, targetBpm },
    });
  };
  const handleChangeRoundCount = (roundCount: number) => {
    roundCount = Math.max(0, roundCount);
    dispatch({
      type: RandomWorkoutFormActionTypes.setState,
      payload: { ...state, roundCount },
    });
  };
  const handleChangeCuesStr = (cuesStr: string) => {
    const updatedCues = cuesStrToCues(cuesStr, state.cues);
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
      <h2>{!!state.id ? `${state.title} - 更新` : '新規作成'}</h2>
      <div>
        <Button variant='contained' onClick={() => navigate('/random/list')}>
          戻る
        </Button>
      </div>
      <div
        style={{ fontSize: 12, color: '#ccc' }}
      >{`createdAt: ${state.createdAt}`}</div>
      <FormControl fullWidth>
        <InputLabel>user</InputLabel>
        <Select
          size='small'
          value={state.uid}
          variant='standard'
          onChange={(e) => handleChangeUid(e.target.value as string)}
        >
          {state.users.map((u) => (
            <MenuItem key={u.id} value={u.id}>
              {u.displayname}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <div>{`beatCount: ${state.beatCount}`}</div>
      <TextField
        size='small'
        fullWidth
        label='title'
        value={state.title}
        onChange={(e) => handleChangeTitle(e.target.value)}
      />
      <TextField
        size='small'
        fullWidth
        label='targetBpm'
        value={state.targetBpm}
        type='number'
        onChange={(e) => handleChangeTargetBpm(Number(e.target.value))}
      />
      <TextField
        size='small'
        fullWidth
        label='recordCount'
        value={state.recordCount}
        type='number'
        onChange={(e) => {
          handleChengeRecordCount(Number(e.target.value));
        }}
      />
      <TextField
        size='small'
        fullWidth
        label='roundCount'
        value={state.roundCount}
        type='number'
        onChange={(e) => handleChangeRoundCount(Number(e.target.value))}
      />
      <TextField
        size='small'
        multiline
        rows={10}
        label='cuesStr'
        onChange={(e) => handleChangeCuesStr(e.target.value)}
        value={state.cuesStr}
      />
      <Table>
        <TableBody>
          {state.cues.map((cue, cueIndex) => (
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
        {!!state.id ? `更新` : '新規作成'}
      </Button>
    </div>
  );
};

export default RandomWorkoutForm;
