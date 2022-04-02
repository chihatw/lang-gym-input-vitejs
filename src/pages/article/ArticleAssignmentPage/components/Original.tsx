import React from 'react';
import { SentencePitchLine } from '@chihatw/pitch-line.sentence-pitch-line';

const Original = ({
  japanese,
  pitchesArray,
}: {
  japanese: string;
  pitchesArray: string[][][];
}) => (
  <div
    style={{
      padding: 8,
      borderRadius: 4,
      backgroundColor: '#eee',
    }}
  >
    <div>{japanese}</div>
    <SentencePitchLine pitchesArray={pitchesArray} />
  </div>
);

export default Original;
