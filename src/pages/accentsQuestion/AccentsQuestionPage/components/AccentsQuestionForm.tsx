import {
  Checkbox,
  FormControl,
  FormControlLabel,
  Grid,
  MenuItem,
  Select,
  Button,
  TextField,
} from '@mui/material';
import React from 'react';
import JapaneseMonitor from './JapaneseMonitor';
import AccentsMonitor from './AccentsMonitor';

import { Audio } from '../../../../entities/Audio';
import { User } from '../../../../services/useUsers';

const AccentsQuestionForm: React.FC<{
  title: string;
  users: User[];
  uid: string;
  isAnswered: boolean;
  japanese: string;
  accentString: string;
  disabledsArray: number[][];
  audios: Audio[];
  onChangeUid: (uid: string) => void;
  onChangeTitle: (title: string) => void;
  onChangeIsAnswered: (isAnswered: boolean) => void;
  onChangeJapanese: (japanese: string) => void;
  onChangeAccentString: (accentString: string) => void;
  onChangeDisabled: (sentenceIndex: number, wordIndex: number) => void;
  onSubmit: () => void;
}> = ({
  users,
  uid,
  title,
  isAnswered,
  japanese,
  accentString,
  disabledsArray,
  audios,
  onChangeTitle,
  onChangeUid,
  onChangeIsAnswered,
  onChangeJapanese,
  onChangeAccentString,
  onChangeDisabled,
  onSubmit,
}) => {
  return (
    <Grid container direction='column' spacing={2}>
      {!!users.length && (
        <Grid item>
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
        </Grid>
      )}
      <Grid item>
        <TextField
          variant='outlined'
          size='small'
          fullWidth
          label='title'
          value={title}
          onChange={(e) => onChangeTitle(e.target.value)}
        />
      </Grid>
      <Grid item>
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
      </Grid>
      <Grid item>
        <TextField
          variant='outlined'
          size='small'
          fullWidth
          label='japanese'
          value={japanese}
          multiline
          rows={5}
          onChange={(e) => onChangeJapanese(e.target.value)}
        />
      </Grid>
      {!!japanese && (
        <Grid item>
          <JapaneseMonitor japanese={japanese} />
        </Grid>
      )}
      <Grid item>
        <TextField
          variant='outlined'
          size='small'
          fullWidth
          label='accentString'
          value={accentString}
          multiline
          rows={5}
          onChange={(e) => onChangeAccentString(e.target.value)}
        />
      </Grid>
      {!!accentString && !!disabledsArray.length && !!audios.length && (
        <Grid item>
          <AccentsMonitor
            accentString={accentString}
            audios={audios}
            disabledsArray={disabledsArray}
            onChangeDisabled={onChangeDisabled}
          />
        </Grid>
      )}
      <Grid item>
        <Button fullWidth variant='contained' onClick={onSubmit}>
          送信
        </Button>
      </Grid>
    </Grid>
  );
};

export default AccentsQuestionForm;
