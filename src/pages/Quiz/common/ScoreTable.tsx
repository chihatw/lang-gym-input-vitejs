import Delete from '@mui/icons-material/Delete';
import { IconButton } from '@mui/material';
import React from 'react';
import { PitchQuizFormState } from '../PitchQuizPage/Model';
import { RhythmQuizFromState } from '../RhythmQuizPage/Model';

const ScoreTable = ({
  state,
  dispatch,
}: {
  state: PitchQuizFormState | RhythmQuizFromState;
  dispatch:
    | React.Dispatch<PitchQuizFormState>
    | React.Dispatch<RhythmQuizFromState>;
}) => {
  const removeScore = (createdAt: number) => {
    if (window.confirm('delete?')) {
      const updatedScores = { ...state.scores };
      delete updatedScores[createdAt];
      const updatedState: PitchQuizFormState | RhythmQuizFromState = {
        ...state,
        scores: updatedScores,
      };

      (dispatch as React.Dispatch<PitchQuizFormState | RhythmQuizFromState>)(
        updatedState
      );
    }
  };
  return (
    <div style={{ display: 'grid', rowGap: 8, fontSize: 12, paddingLeft: 20 }}>
      {Object.values(state.scores).map((score, index) => {
        const date = new Date(score.createdAt);
        const year = date.getFullYear();
        const month = date.getMonth() + 1;
        const day = date.getDate();
        return (
          <div
            key={index}
            style={{
              display: 'grid',
              gridTemplateColumns: '120px 80px auto',
              alignItems: 'center',
            }}
          >
            <div>{`${year}/${month}/${day}`}</div>
            <div>{`${score.score}/${state.questionCount}`}</div>
            <div>
              <IconButton onClick={() => removeScore(score.createdAt)}>
                <Delete />
              </IconButton>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ScoreTable;
