import { Checkbox, FormControlLabel } from '@mui/material';
import React from 'react';
import { RhythmQuizState } from '../Model';
import { RhythmQuizAction, RhythmQuizActionTypes } from '../Update';

const AnsweredCheckbox = ({
  state,
  dispatch,
}: {
  state: RhythmQuizState;
  dispatch: React.Dispatch<RhythmQuizAction>;
}) => {
  const { answered } = state;
  return (
    <FormControlLabel
      label='answered'
      control={
        <Checkbox
          color='primary'
          checked={answered}
          onChange={(e) => {
            dispatch({
              type: RhythmQuizActionTypes.changeAnswered,
              payload: e.target.checked,
            });
          }}
        />
      }
    />
  );
};

export default AnsweredCheckbox;
