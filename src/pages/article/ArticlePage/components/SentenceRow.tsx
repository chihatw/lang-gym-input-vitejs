import Speaker from '@bit/chihatw.lang-gym.speaker';
import React, { useMemo, useState } from 'react';
import { SentencePitchLine } from '@chihatw/pitch-line.sentence-pitch-line';
import accentesForPitchesArray from 'accents-for-pitches-array';
import { Card, Collapse, IconButton } from '@mui/material';
import { Edit, FileCopyOutlined, SettingsOutlined } from '@mui/icons-material';

import { Sentence } from '../../../../entities/Sentence';
import EditSentencePane from './EditSentencePane';
import { SentenceParseNew } from '../../../../services/useSentenceParseNews';
import { ComplexSentencePane } from '../../../../components/complex-sentence-pane';
import sentenceParseNew2SentenceParseProps from 'sentence-parse-new2sentence-parse-props';

const SentenceRow = ({
  sentence,
  downloadURL,
  sentenceParseNew,
  openEditParsePage,
  copySentenceParseNew,
}: {
  sentence: Sentence;
  downloadURL: string;
  sentenceParseNew: SentenceParseNew;
  openEditParsePage: () => void;
  copySentenceParseNew: () => void;
}) => {
  const { units, sentences, sentenceArrays } = useMemo(
    () =>
      sentenceParseNew2SentenceParseProps({
        words: sentenceParseNew.words,
        units: sentenceParseNew.units,
        branches: sentenceParseNew.branches,
        sentences: sentenceParseNew.sentences,
        sentenceArrays: sentenceParseNew.sentenceArrays,
      }),
    [sentenceParseNew]
  );

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
          {!!sentenceParseNew && (
            <div style={{ overflowX: 'scroll' }}>
              <ComplexSentencePane
                Cursor={null}
                units={units}
                sentences={sentences}
                sentenceArrays={sentenceArrays}
              />
            </div>
          )}
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
            <IconButton size='small' onClick={copySentenceParseNew}>
              <FileCopyOutlined />
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
