import * as R from 'ramda';
import { TextField } from '@mui/material';
import React from 'react';
import { PitchQuizFormState } from './Model';

const StartForm = ({
  state,
  dispatch,
  sentenceIndex,
}: {
  state: PitchQuizFormState;
  dispatch: React.Dispatch<PitchQuizFormState>;
  sentenceIndex: number;
}) => {
  const question = state.questions[sentenceIndex];
  const handleChange = (start: number) => {
    const updatedState = R.assocPath<number, PitchQuizFormState>(
      ['questions', sentenceIndex, 'start'],
      start
    )(state);
    dispatch(updatedState);
  };
  return (
    <TextField
      size='small'
      sx={{ flexBasis: 80 }}
      label='start'
      type='number'
      autoComplete='off'
      value={question.start}
      onChange={(e) => handleChange(Number(e.target.value))}
      inputProps={{ step: 0.1, min: 0 }}
    />
  );
};

export default StartForm;
