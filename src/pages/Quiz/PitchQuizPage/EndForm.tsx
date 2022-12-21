import { TextField } from '@mui/material';
import * as R from 'ramda';
import React from 'react';
import { PitchQuizFormState } from './Model';

const EndForm = ({
  state,
  dispatch,
  sentenceIndex,
}: {
  state: PitchQuizFormState;
  dispatch: React.Dispatch<PitchQuizFormState>;
  sentenceIndex: number;
}) => {
  const question = state.questions[sentenceIndex];
  const handleChange = (end: number) => {
    const updatedState = R.assocPath<number, PitchQuizFormState>(
      ['questions', sentenceIndex, 'end'],
      end
    )(state);
    dispatch(updatedState);
  };
  return (
    <TextField
      size='small'
      sx={{ flexBasis: 80 }}
      label='end'
      type='number'
      autoComplete='off'
      value={question.end}
      onChange={(e) => handleChange(Number(e.target.value))}
      inputProps={{ step: 0.1, min: 0 }}
    />
  );
};

export default EndForm;
