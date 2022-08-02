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

import { Audio } from '../../../../../entities/Audio';
import { State, User } from '../../../../../Model';
import { Question } from '../../../../../services/useQuestions';
import { Action } from '../../../../../Update';

import RhythmsMonitor from './RhythmsMonitor';

const RhythmsQuestionForm = ({
  state,
  dispatch,
  users,
  uid,
  title,
  isAnswered,
  rhythmString,
  disabledsArray,
  audios,
  questions,
  onSubmit,
  onChangeUid,
  onChangeTitle,
  onChangeIsAnswered,
  onChangeRhythmString,
}: {
  state: State;
  dispatch: React.Dispatch<Action>;
  title: string;
  users: User[];
  uid: string;
  isAnswered: boolean;
  rhythmString: string;
  disabledsArray: string[][][];
  audios: Audio[];
  questions: Question[];
  onSubmit: () => void;
  onChangeUid: (uid: string) => void;
  onChangeTitle: (title: string) => void;
  onChangeIsAnswered: (isAnswered: boolean) => void;
  onChangeRhythmString: (rhythmString: string) => void;
}) => {
  return (
    <div style={{ display: 'grid', rowGap: 16 }}>
      {!!users.length && (
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
        </FormControl>
      )}

      <TextField
        variant='outlined'
        size='small'
        fullWidth
        label='title'
        value={title}
        onChange={(e) => onChangeTitle(e.target.value)}
      />

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

      {!!rhythmString && !!audios.length && !!disabledsArray.length && (
        <RhythmsMonitor questions={questions} />
      )}

      <Button fullWidth variant='contained' onClick={onSubmit}>
        送信
      </Button>
    </div>
  );
};

export default RhythmsQuestionForm;
