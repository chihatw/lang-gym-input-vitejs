import React from 'react';
import Speaker from '@bit/chihatw.lang-gym.speaker';
import { Edit } from '@mui/icons-material';
import { IconButton } from '@mui/material';
import { SentencePitchLine } from '@chihatw/pitch-line.sentence-pitch-line';

const Assignment = ({
  end,
  start,
  downloadURL,
  pitchesArray,
  handleClick,
}: {
  end: number;
  start: number;
  pitchesArray: string[][][];
  downloadURL: string;
  handleClick: () => void;
}) => (
  <div style={{ padding: '0 8px' }}>
    <SentencePitchLine pitchesArray={pitchesArray} />
    <div
      style={{
        display: 'flex',
        justifyContent: 'space-between',
      }}
    >
      <Speaker start={start} end={end} downloadURL={downloadURL} />
      <IconButton onClick={handleClick}>
        <Edit />
      </IconButton>
    </div>
  </div>
);

export default Assignment;
