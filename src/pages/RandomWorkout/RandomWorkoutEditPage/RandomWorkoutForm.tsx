import * as R from 'ramda';
import { SentencePitchLine } from '@chihatw/pitch-line.sentence-pitch-line';
import {
  Button,
  FormControl,
  FormControlLabel,
  Input,
  InputLabel,
  MenuItem,
  Select,
  Switch,
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
import { User } from '../../../Model';

const RandomWorkoutForm = ({
  users,
  pageState,
  handleSubmit,
  pageDispatch,
}: {
  users: User[];
  pageState: RandomWorkoutFormState;
  handleSubmit: () => void;
  pageDispatch: React.Dispatch<RandomWorkoutFormState>;
}) => {
  const navigate = useNavigate();

  const handleChengeCount = (recordCount: number) => {
    pageDispatch({ ...pageState, recordCount });
  };

  const handleChangeUid = (uid: string) => {
    pageDispatch({ ...pageState, uid });
  };

  const handleChangeTitle = (title: string) => {
    pageDispatch({ ...pageState, title });
  };

  const handleChangeTargetBpm = (targetBpm: number) => {
    targetBpm = Math.max(0, targetBpm);
    pageDispatch({ ...pageState, targetBpm });
  };

  const handleChangeRound = (roundCount: number) => {
    pageDispatch({
      ...pageState,
      roundCount,
    });
  };

  const handleChangeCuesStr = (cuesStr: string) => {
    const updatedCues = cuesStrToCues(cuesStr, pageState.cues);
    const updatedBeatCount = calcBeatCount(updatedCues);
    pageDispatch({
      ...pageState,
      cues: updatedCues,
      cuesStr,
      beatCount: updatedBeatCount,
    });
  };

  return (
    <div style={{ display: 'grid', rowGap: 16 }}>
      <h2>{!!pageState.id ? `${pageState.title} - 更新` : '新規作成'}</h2>
      <div>
        <Button variant='contained' onClick={() => navigate('/random/list')}>
          戻る
        </Button>
      </div>
      <div
        style={{ fontSize: 12, color: '#ccc' }}
      >{`createdAt: ${pageState.createdAt}`}</div>
      <FormControl fullWidth>
        <InputLabel>user</InputLabel>
        <Select
          size='small'
          value={pageState.uid}
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
      <div>{`beatCount: ${pageState.beatCount}`}</div>
      <TextField
        size='small'
        fullWidth
        label='title'
        value={pageState.title}
        onChange={(e) => handleChangeTitle(e.target.value)}
        autoComplete='off'
      />
      <TextField
        size='small'
        fullWidth
        label='targetBpm'
        value={pageState.targetBpm}
        type='number'
        onChange={(e) => handleChangeTargetBpm(Number(e.target.value))}
      />
      <TextField
        type='number'
        size='small'
        label='Count'
        value={pageState.recordCount}
        onChange={(e) => handleChengeCount(Number(e.target.value))}
        fullWidth
        InputProps={{ inputProps: { min: 0 } }}
      />
      <FormControl>
        <InputLabel id='roundSelect'>Round</InputLabel>
        <Select
          labelId='roundSelect'
          size='small'
          label='Round'
          value={pageState.roundCount}
          onChange={(e) => handleChangeRound(Number(e.target.value))}
        >
          <MenuItem value={1}>1</MenuItem>
          <MenuItem value={2}>2</MenuItem>
        </Select>
      </FormControl>

      <TextField
        size='small'
        multiline
        rows={10}
        label='cuesStr'
        onChange={(e) => handleChangeCuesStr(e.target.value)}
        value={pageState.cuesStr}
        autoComplete='off'
      />
      <Table>
        <TableBody>
          {pageState.cues.map((cue, cueIndex) => (
            <TableRow key={cueIndex}>
              <TableCell>{cue.label}</TableCell>
              <TableCell>
                <SentencePitchLine
                  pitchesArray={string2PitchesArray(cue.pitchStr)}
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <Button
        variant='contained'
        sx={{ color: 'white' }}
        onClick={handleSubmit}
      >
        {!!pageState.id ? `更新` : '新規作成'}
      </Button>
    </div>
  );
};

export default RandomWorkoutForm;
