import * as R from 'ramda';
import DeleteIcon from '@mui/icons-material/Delete';
import { IconButton, TextField } from '@mui/material';
import React from 'react';
import { RhythmQuizFromState } from '../../Model';
import { QuizQuestion } from '../../../../../Model';

const SentenceHeader = ({
  state,
  sentenceIndex,
  dispatch,
}: {
  state: RhythmQuizFromState;
  sentenceIndex: number;
  dispatch: React.Dispatch<RhythmQuizFromState>;
}) => {
  const question = state.questions[sentenceIndex];

  const handleChangeStart = (start: number) => {
    const updatedState = R.compose(
      R.assocPath<number, RhythmQuizFromState>(
        ['questions', sentenceIndex, 'start'],
        start
      )
    )(state);
    dispatch(updatedState);
  };

  const handleChangeEnd = (end: number) => {
    const updatedState = R.compose(
      R.assocPath<number, RhythmQuizFromState>(
        ['questions', sentenceIndex, 'end'],
        end
      )
    )(state);
    dispatch(updatedState);
  };

  const handleDelete = () => {
    const kanas = state.input.kana.split('\n');
    kanas.splice(sentenceIndex, 1);

    const updatedQuestions = [...state.questions];
    updatedQuestions.splice(sentenceIndex, 1);

    const updatedState = R.compose(
      R.assocPath<string, RhythmQuizFromState>(
        ['input', 'kana'],
        kanas.join('\n')
      ),
      R.assocPath<QuizQuestion[], RhythmQuizFromState>(
        ['questions'],
        updatedQuestions
      )
    )(state);
    dispatch(updatedState);
  };
  return (
    <div style={{ display: 'flex', alignItems: 'center', columnGap: 16 }}>
      <div>{sentenceIndex + 1}</div>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '80px 80px 80px',
          columnGap: 8,
        }}
      >
        <TextField
          inputProps={{ step: 0.1 }}
          type='number'
          size='small'
          value={question.start}
          label='start'
          onChange={(e) => handleChangeStart(Number(e.target.value))}
        />
        <TextField
          inputProps={{ step: 0.1 }}
          type='number'
          size='small'
          value={question.end}
          label='end'
          onChange={(e) => handleChangeEnd(Number(e.target.value))}
        />
      </div>
      <IconButton size='small' onClick={handleDelete}>
        <DeleteIcon />
      </IconButton>
    </div>
  );
};

export default SentenceHeader;
