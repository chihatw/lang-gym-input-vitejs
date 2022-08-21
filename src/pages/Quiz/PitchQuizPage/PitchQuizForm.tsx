import * as R from 'ramda';
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
import { PitchQuizFormState } from './Model';
import RowPitchMonitor from './RowPitchMonitor';
import ScoreTable from '../common/ScoreTable';
import { QuizQuestion } from '../../../Model';

const PitchQuizForm = ({
  state,
  dispatch,
  handleSubmit,
}: {
  state: PitchQuizFormState;
  dispatch: React.Dispatch<PitchQuizFormState>;
  handleSubmit: () => void;
}) => {
  const handleChangeUid = (uid: string) => {
    const updatedState: PitchQuizFormState = { ...state, uid };
    dispatch(updatedState);
  };
  const handleChangeTitle = (title: string) => {
    const updatedState: PitchQuizFormState = { ...state, title };
    dispatch(updatedState);
  };
  const handleChangeJapanese = (input: string) => {
    const japaneses = input.split('\n');
    const updatedQuestions: QuizQuestion[] = [];
    japaneses.forEach((japanese, index) => {
      const questions = state.questions;
      const question = questions[index];
      const updatedQuestion: QuizQuestion = {
        end: question?.end || 0,
        start: question?.start || 0,
        japanese,
        disableds: question?.disableds || [],
        pitchStr: question?.pitchStr || '',
        syllables: question?.syllables || {},
      };
      updatedQuestions.push(updatedQuestion);
    });

    const updatedState = R.compose(
      R.assocPath<string, PitchQuizFormState>(['input', 'japanese'], input),
      R.assocPath<QuizQuestion[], PitchQuizFormState>(
        ['questions'],
        updatedQuestions
      )
    )(state);

    dispatch(updatedState);
  };
  const handleChangePitchStr = (input: string) => {
    const pitchStrs = input.split('\n');
    const updatedQuestions: QuizQuestion[] = [];
    state.questions.forEach((question, index) => {
      const pitchStr = pitchStrs[index];
      const updatedQuestion: QuizQuestion = {
        ...question,
        pitchStr,
      };
      updatedQuestions.push(updatedQuestion);
    });
    const updatedState = R.compose(
      R.assocPath<string, PitchQuizFormState>(['input', 'pitch'], input),
      R.assocPath<QuizQuestion[], PitchQuizFormState>(
        ['questions'],
        updatedQuestions
      )
    )(state);

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
          value={state.input.japanese}
          multiline
          rows={5}
          onChange={(e) => handleChangeJapanese(e.target.value)}
        />

        {!!state.input.japanese && (
          <JapaneseMonitor japanese={state.input.japanese} />
        )}

        <TextField
          variant='outlined'
          size='small'
          fullWidth
          label='accentString'
          value={state.input.pitch}
          multiline
          rows={5}
          onChange={(e) => handleChangePitchStr(e.target.value)}
        />

        {!!state.input.pitch && (
          <div style={{ fontSize: 12, color: '#555' }}>
            <div style={{ display: 'grid', rowGap: 8 }}>
              {state.questions.map((_, sentenceIndex) => (
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

export default PitchQuizForm;
