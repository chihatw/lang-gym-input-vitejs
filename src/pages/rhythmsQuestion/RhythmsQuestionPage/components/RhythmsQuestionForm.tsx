import {
  Checkbox,
  FormControl,
  FormControlLabel,
  MenuItem,
  Select,
  Button,
  TextField,
} from '@mui/material';
import React from 'react';

import { Audio } from '../../../../entities/Audio';
import { User } from '../../../../services/useUsers';
import RhythmsMonitor from './RhythmsMonitor';

const RhythmsQuestionForm: React.FC<{
  title: string;
  users: User[];
  uid: string;
  isAnswered: boolean;
  rhythmString: string;
  disabledsArray: string[][][];
  audios: Audio[];
  onSubmit: () => void;
  onChangeUid: (uid: string) => void;
  onChangeTitle: (title: string) => void;
  onChangeIsAnswered: (isAnswered: boolean) => void;
  onChangeRhythmString: (rhythmString: string) => void;
}> = ({
  users,
  uid,
  title,
  isAnswered,
  rhythmString,
  disabledsArray,
  audios,
  onSubmit,
  onChangeUid,
  onChangeTitle,
  onChangeIsAnswered,
  onChangeRhythmString,
}) => {
  return (
    <div>
      {!!users.length && (
        <>
          <FormControl fullWidth>
            <Select
              value={uid}
              onChange={(e) => onChangeUid(e.target.value as string)}
            >
              {users.map((u) => (
                <MenuItem key={u.id} value={u.id}>
                  {u.displayname}
                </MenuItem>
              ))}
            </Select>
          </FormControl>{' '}
          <div style={{ height: 16 }} />
        </>
      )}

      <TextField
        variant='outlined'
        size='small'
        fullWidth
        label='title'
        value={title}
        onChange={(e) => onChangeTitle(e.target.value)}
      />
      <div style={{ height: 16 }} />

      <FormControlLabel
        label='answered'
        control={
          <Checkbox
            color='primary'
            checked={isAnswered}
            onChange={(e) => onChangeIsAnswered(e.target.checked)}
          />
        }
      />

      <div style={{ height: 16 }} />

      <TextField
        variant='outlined'
        size='small'
        fullWidth
        label='rhythmString'
        value={rhythmString}
        multiline
        rows={5}
        onChange={(e) => onChangeRhythmString(e.target.value)}
      />

      <div style={{ height: 16 }} />
      {!!rhythmString && !!audios.length && !!disabledsArray.length && (
        <>
          <RhythmsMonitor />
          <div style={{ height: 16 }} />
        </>
      )}

      <Button fullWidth variant='contained' onClick={onSubmit}>
        送信
      </Button>
    </div>
  );
};

export default RhythmsQuestionForm;
