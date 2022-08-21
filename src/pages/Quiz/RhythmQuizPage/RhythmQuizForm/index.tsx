import { Button, TextField } from '@mui/material';
import React from 'react';
import TableLayout from '../../../../components/templates/TableLayout';
import {
  buildSentenceRhythm,
  buildUpdatedRythmState,
} from '../../../../services/quiz';
import ScoreTable from '../../common/ScoreTable';
import { RhythmQuizFromState } from '../Model';
import SelectUid from './SelectUid';
import SentenceDisableds from './SentenceDisableds';

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

  const handleChangeRhythmString = (rhythmString: string) => {
    rhythmString = rhythmString.replaceAll(' ', '　');
    const updatedRhythmArray = buildUpdatedRythmState(
      rhythmString,
      state.rhythmArray
    );
    const updatedState: RhythmQuizFromState = {
      ...state,
      rhythmString,
      rhythmArray: updatedRhythmArray,
    };
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
          value={state.rhythmString}
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
          {state.rhythmArray.map((_, sentenceIndex) => (
            <SentenceDisableds
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
