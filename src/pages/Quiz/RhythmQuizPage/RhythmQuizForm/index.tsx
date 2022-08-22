import * as R from 'ramda';
import { Button, TextField } from '@mui/material';
import React from 'react';
import TableLayout from '../../../../components/templates/TableLayout';
import { QuizQuestion, Syllable } from '../../../../Model';
import { buildSentenceRhythm } from '../../../../services/quiz';
import ScoreTable from '../../common/ScoreTable';
import { RhythmQuizFromState } from '../Model';
import SelectUid from './SelectUid';
import SentenceRhythmMonitor from './SentenceRhythmMonitor';

const RhythmQuizForm = ({
  state,
  dispatch,
  onSubmit,
}: {
  state: RhythmQuizFromState;
  dispatch: React.Dispatch<RhythmQuizFromState>;
  onSubmit: () => void;
}) => {
  const handleChangeTitle = (title: string) => {
    const updatedState: RhythmQuizFromState = { ...state, title };
    dispatch(updatedState);
  };

  const handleChangeKana = (kana: string) => {
    kana = kana.replaceAll(' ', '　');
    const kanas = kana.split('\n');
    const updatedQuestions: QuizQuestion[] = [];
    kanas.forEach((kana, index) => {
      const question = state.questions[index];
      const syllables: { [index: number]: Syllable[] } = {};
      const { sentenceRhythm } = buildSentenceRhythm(kana);
      sentenceRhythm.forEach((wordRhythm, wordIndex) => {
        syllables[wordIndex] = wordRhythm;
      });

      const updatedQuestion: QuizQuestion = {
        end: question?.end || 0,
        start: question?.start || 0,
        japanese: question?.japanese || '',
        disableds: question?.disableds || [],
        pitchStr: question?.pitchStr || '',
        syllables,
      };
      updatedQuestions.push(updatedQuestion);
    });
    const updatedState = R.compose(
      R.assocPath<string, RhythmQuizFromState>(['input', 'kana'], kana),
      R.assocPath<QuizQuestion[], RhythmQuizFromState>(
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
          <SelectUid state={state} dispatch={dispatch} />
        )}

        <TextField
          variant='outlined'
          size='small'
          fullWidth
          label='title'
          value={state.title}
          onChange={(e) => handleChangeTitle(e.target.value)}
        />
        <div>{`questionCount: ${state.questionCount}`}</div>
        <TextField
          variant='outlined'
          size='small'
          fullWidth
          label='rhythmString'
          value={state.input.kana}
          multiline
          rows={5}
          onChange={(e) => handleChangeKana(e.target.value)}
        />

        <div
          style={{
            fontSize: 12,
            color: '#555',
            display: 'grid',
            rowGap: 16,
          }}
        >
          {state.questions.map((_, sentenceIndex) => (
            <SentenceRhythmMonitor
              key={sentenceIndex}
              state={state}
              dispatch={dispatch}
              sentenceIndex={sentenceIndex}
            />
          ))}
        </div>
        <ScoreTable state={state} dispatch={dispatch} />
        <Button fullWidth variant='contained' onClick={onSubmit}>
          送信
        </Button>
      </div>
    </TableLayout>
  );
};

export default RhythmQuizForm;
