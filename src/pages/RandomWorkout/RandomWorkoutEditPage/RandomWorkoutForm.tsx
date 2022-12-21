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

  const handleChengeRecordCount = (recordCount: number) => {
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

  const handleChangeRoundCount = (roundCount: number) => {
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

  const handleChangeImagePath = (imagePath: string, cueIndex: number) => {
    const updated = R.assocPath<string, RandomWorkoutFormState>(
      ['cues', cueIndex, 'imagePath'],
      imagePath
    )(pageState);
    pageDispatch(updated);
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
        label='recordCount'
        value={pageState.recordCount}
        onChange={(e) => {
          handleChengeRecordCount(Number(e.target.value));
        }}
        fullWidth
        InputProps={{ inputProps: { min: 0 } }}
      />
      <TextField
        type='number'
        size='small'
        label='roundCount'
        value={pageState.roundCount}
        onChange={(e) => handleChangeRoundCount(Number(e.target.value))}
        fullWidth
        InputProps={{ inputProps: { min: 0 } }}
      />
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
