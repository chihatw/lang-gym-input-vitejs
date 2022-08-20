import React from 'react';
import TableLayout from '../../../components/templates/TableLayout';
import {
  Button,
  FormControl,
  MenuItem,
  Select,
  TextField,
} from '@mui/material';
import JapaneseMonitor from './JapaneseMonitor';
import { AccentQuizFormState } from './Model';
import RowPitchMonitor from './RowPitchMonitor';
import ScoreTable from './ScoreTable';

const AccentQuizForm = ({
  state,
  dispatch,
  handleSubmit,
}: {
  state: AccentQuizFormState;
  dispatch: React.Dispatch<AccentQuizFormState>;
  handleSubmit: () => void;
}) => {
  const handleChangeUid = (uid: string) => {
    const updatedState: AccentQuizFormState = { ...state, uid };
    dispatch(updatedState);
  };
  const handleChangeTitle = (title: string) => {
    const updatedState: AccentQuizFormState = { ...state, title };
    dispatch(updatedState);
  };
  const handleChangeJapanese = (japanese: string) => {
    const updatedState: AccentQuizFormState = { ...state, japanese };
    dispatch(updatedState);
  };
  const handleChangePitchStr = (pitchStr: string) => {
    const updatedState: AccentQuizFormState = { ...state, pitchStr };
    dispatch(updatedState);
  };
  return (
    <TableLayout title={state.title} backURL='/quiz/list'>
      <div style={{ display: 'grid', rowGap: 16 }}>
        {!!state.users.length && (
          <FormControl fullWidth>
            <Select
              value={state.uid}
              onChange={(e) => handleChangeUid(e.target.value as string)}
            >
              {state.users.map((u) => (
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
          value={state.title}
          onChange={(e) => handleChangeTitle(e.target.value)}
        />

        <TextField
          variant='outlined'
          size='small'
          fullWidth
          label='japanese'
          value={state.japanese}
          multiline
          rows={5}
          onChange={(e) => handleChangeJapanese(e.target.value)}
        />

        {!!state.japanese && <JapaneseMonitor japanese={state.japanese} />}

        <TextField
          variant='outlined'
          size='small'
          fullWidth
          label='accentString'
          value={state.pitchStr}
          multiline
          rows={5}
          onChange={(e) => handleChangePitchStr(e.target.value)}
        />

        {!!state.pitchStr && !!state.disabledsArray.length && (
          <div style={{ fontSize: 12, color: '#555' }}>
            <div style={{ display: 'grid', rowGap: 8 }}>
              {state.pitchStr.split('\n').map((_, sentenceIndex) => (
                <RowPitchMonitor
                  key={sentenceIndex}
                  state={state}
                  dispatch={dispatch}
                  sentenceIndex={sentenceIndex}
                />
              ))}
            </div>
          </div>
        )}
        <ScoreTable state={state} dispatch={dispatch} />
        <Button fullWidth variant='contained' onClick={handleSubmit}>
          送信
        </Button>
      </div>
    </TableLayout>
  );
};

export default AccentQuizForm;
