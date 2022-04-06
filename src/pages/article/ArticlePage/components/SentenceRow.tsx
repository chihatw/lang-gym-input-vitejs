import Speaker from '@bit/chihatw.lang-gym.speaker';
import React, { useState } from 'react';
import { SentencePitchLine } from '@chihatw/pitch-line.sentence-pitch-line';
import accentesForPitchesArray from 'accents-for-pitches-array';
import { Edit, SettingsOutlined } from '@mui/icons-material';
import { Card, Collapse, IconButton } from '@mui/material';

import { Sentence } from '../../../../entities/Sentence';
import EditSentencePane from './EditSentencePane';

const SentenceRow = ({
  sentence,
  downloadURL,
  openEditParsePage,
}: {
  sentence: Sentence;
  downloadURL: string;
  openEditParsePage: () => void;
}) => {
  const [open, setOpen] = useState(false);
  const handleClickEditButton = () => setOpen(!open);
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
        <div>
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

            <IconButton size='small' onClick={handleClickEditButton}>
              <Edit />
            </IconButton>
          </div>
          <Collapse in={open}>
            <EditSentencePane
              sentence={sentence}
              callback={() => setOpen(false)}
            />
          </Collapse>
        </div>
      </div>
    </Card>
  );
};

export default SentenceRow;
