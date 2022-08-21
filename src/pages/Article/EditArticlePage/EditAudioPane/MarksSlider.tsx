import { Slider } from '@mui/material';
import React from 'react';
import { updateSentence } from '../../../../services/article';
import { buildMarks, buildSentenceLines } from '../../../../services/wave';
import { ArticleVoiceState } from '../Model';

const MarksSlider = ({
  state,
  dispatch,
}: {
  state: ArticleVoiceState;
  dispatch: React.Dispatch<ArticleVoiceState>;
}) => {
  const { blankDuration, sampleRate, channelData, scale } = state;

  const handleChange = (blankDuration: number) => {
    if (!channelData) return;
    const marks = buildMarks({
      sampleRate,
      channelData,
      blankDuration,
    });
    const sentenceLines = buildSentenceLines({ marks, scale });

    const updatedState: ArticleVoiceState = {
      ...state,
      sentenceLines,
      marks,
      blankDuration,
    };

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
        <div style={{ color: '#555' }}>{blankDuration}</div>
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
            value={blankDuration}
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
