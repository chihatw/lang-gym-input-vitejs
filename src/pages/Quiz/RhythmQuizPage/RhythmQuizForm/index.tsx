import { Button, TextField } from '@mui/material';
import React from 'react';
import TableLayout from '../../../../components/templates/TableLayout';
import { buildUpdatedRythmState } from '../../../../services/quiz';
import { RhythmQuizState } from '../Model';
import { RhythmQuizAction, RhythmQuizActionTypes } from '../Update';
import AnsweredCheckbox from './AnsweredCheckbox';
import SelectUid from './SelectUid';
import SentenceDisableds from './SentenceDisableds';

const RhythmQuizForm = ({
  state,
  dispatch,
  onSubmit,
}: {
  state: RhythmQuizState;
  dispatch: React.Dispatch<RhythmQuizAction>;
  onSubmit: () => void;
}) => {
  const { users, title, rhythmString, disabledsArray, questionCount } = state;

  const handleChangeRhythmString = (rhythmString: string) => {
    rhythmString = rhythmString.replaceAll(' ', '　');
    const { rhythmArray, disabledsArray: _disabledsArray } =
      buildUpdatedRythmState(rhythmString, disabledsArray);
    dispatch({
      type: RhythmQuizActionTypes.changeRhythmString,
      payload: { rhythmArray, rhythmString, disabledsArray: _disabledsArray },
    });
  };

  return (
    <TableLayout title={title} backURL='/accentsQuestion/list'>
      <div style={{ display: 'grid', rowGap: 16 }}>
        {!!users.length && (
          <SelectUid users={users} state={state} dispatch={dispatch} />
        )}

        <TextField
          variant='outlined'
          size='small'
          fullWidth
          label='title'
          value={title}
          onChange={(e) => {
            dispatch({
              type: RhythmQuizActionTypes.changeTitle,
              payload: e.target.value,
            });
          }}
        />

        <AnsweredCheckbox state={state} dispatch={dispatch} />
        <div>{`questionCount: ${questionCount}`}</div>
        <TextField
          variant='outlined'
          size='small'
          fullWidth
          label='rhythmString'
          value={rhythmString}
          multiline
          rows={5}
          onChange={(e) => handleChangeRhythmString(e.target.value)}
        />

        <div
          style={{
            fontSize: 12,
            color: '#555',
            display: 'grid',
            rowGap: 16,
          }}
        >
          {disabledsArray.map((_, sentenceIndex) => (
            <SentenceDisableds
              key={sentenceIndex}
              state={state}
              dispatch={dispatch}
              sentenceIndex={sentenceIndex}
            />
          ))}
        </div>

        <Button fullWidth variant='contained' onClick={onSubmit}>
          送信
        </Button>
      </div>
    </TableLayout>
  );
};

export default RhythmQuizForm;
