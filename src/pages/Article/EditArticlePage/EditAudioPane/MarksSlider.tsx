import * as R from 'ramda';
import { Slider } from '@mui/material';
import React from 'react';
import { buildMarks } from '../../../../services/wave';
import { ArticleEditState } from '../Model';
import { ArticleSentence } from '../../../../Model';

const MarksSlider = ({
  state,
  dispatch,
}: {
  state: ArticleEditState;
  dispatch: React.Dispatch<ArticleEditState>;
}) => {
  const handleChange = (blankDuration: number) => {
    if (!state.wave.channelData || !state.audioContext) return;
    const marks = buildMarks({
      sampleRate: state.audioContext.sampleRate,
      channelData: state.wave.channelData,
      blankDuration,
    });

    const updatedSentences = [...state.sentences];
    for (let i = 0; i < state.sentences.length; i++) {
      updatedSentences[i].start = marks[i]?.start || 0;
      updatedSentences[i].end = marks[i]?.end || 0;
    }

    const updatedState = R.compose(
      R.assocPath<number, ArticleEditState>(
        ['wave', 'blankDuration'],
        blankDuration
      ),
      R.assocPath<ArticleSentence[], ArticleEditState>(
        ['sentences'],
        updatedSentences
      )
    )(state);
    dispatch(updatedState);
  };

  return (
    <div
      style={{
        padding: '0 16px',
        background: '#eee',
        borderRadius: 4,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <div style={{ color: '#555' }}>{state.wave.blankDuration}</div>
        <div
          style={{
            padding: 8,
            flexBasis: 200,
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <Slider
            min={400}
            max={1200}
            value={state.wave.blankDuration}
            onChange={(e, value) => {
              typeof value === 'number' && handleChange(value);
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default MarksSlider;
