import React from 'react';
import Speaker from '@bit/chihatw.lang-gym.speaker';
import { Card, IconButton } from '@mui/material';
import { SentencePitchLine } from '@chihatw/pitch-line.sentence-pitch-line';
import accentesForPitchesArray from 'accents-for-pitches-array';
import { Edit, SettingsOutlined } from '@mui/icons-material';

import { Sentence } from '../../../../entities/Sentence';

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
      <div style={{ padding: 16, fontSize: 12, color: '#555' }}>
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
        <div style={{ height: 16 }} />
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-end',
          }}
        >
          {!!downloadURL && sentence.end - sentence.start > 0 && (
            <Speaker
              end={sentence.end}
              start={sentence.start}
              downloadURL={downloadURL}
            />
          )}

          <IconButton size='small' onClick={openEditParsePage}>
            <SettingsOutlined />
          </IconButton>

          <IconButton size='small' onClick={openEditPage}>
            <Edit />
          </IconButton>
        </div>
      </div>
    </Card>
  );
};

export default SentenceRow;
