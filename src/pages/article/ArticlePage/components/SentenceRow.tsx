import React from 'react';
import { Card } from '@mui/material';
import { SentencePitchLine } from '@chihatw/pitch-line.sentence-pitch-line';
import accentesForPitchesArray from 'accents-for-pitches-array';

import { Sentence } from '../../../../entities/Sentence';
import EditSentencePane from './EditSentencePane';

const SentenceRow = ({
  sentence,
  downloadURL,
  openEditPage,
  openEditParsePage,
}: {
  sentence: Sentence;
  downloadURL: string;
  openEditPage: () => void;
  openEditParsePage: () => void;
}) => {
  return (
    <Card>
      <div
        style={{
          color: '#555',
          rowGap: 16,
          padding: 16,
          display: 'grid',
          fontSize: 12,
        }}
      >
        <div style={{ display: 'grid', rowGap: 4 }}>
          <div style={{ userSelect: 'none' }}>{`${sentence.line + 1}. ${
            sentence.japanese
          }`}</div>
          <div style={{ color: '#aaa' }}>{sentence.original}</div>
          <div style={{ color: '#52a2aa' }}>{sentence.chinese}</div>
          <SentencePitchLine
            pitchesArray={accentesForPitchesArray(sentence.accents)}
          />
        </div>
        <EditSentencePane
          sentence={sentence}
          downloadURL={downloadURL}
          openEditPage={openEditPage}
          openEditParsePage={openEditParsePage}
        />
      </div>
    </Card>
  );
};

export default SentenceRow;
