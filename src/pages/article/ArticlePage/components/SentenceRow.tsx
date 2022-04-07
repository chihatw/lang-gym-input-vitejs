import Speaker from '@bit/chihatw.lang-gym.speaker';
import { Card, IconButton } from '@mui/material';
import { SentencePitchLine } from '@chihatw/pitch-line.sentence-pitch-line';
import accentsForPitchesArray from 'accents-for-pitches-array';
import React, { useMemo, useState } from 'react';
import sentenceParseNew2SentenceParseProps from 'sentence-parse-new2sentence-parse-props';
import {
  Edit,
  Person,
  FileCopyOutlined,
  SettingsOutlined,
} from '@mui/icons-material';

import { Sentence } from '../../../../entities/Sentence';
import EditSentencePane from './EditSentencePane';
import EditAssignmentPane from './EditAssignmentPane';
import { SentenceParseNew } from '../../../../services/useSentenceParseNews';
import { AssignmentSentence } from '../../../../services/useAssignmentSentences';
import { ComplexSentencePane } from '../../../../components/complex-sentence-pane';

const SentenceRow = ({
  sentence,
  downloadURL,
  sentenceParseNew,
  assignmentSentence,
  assignmentDownloadURL,
  openEditParsePage,
  copySentenceParseNew,
}: {
  sentence: Sentence;
  downloadURL: string;
  sentenceParseNew: SentenceParseNew | null;
  assignmentSentence: AssignmentSentence | null;
  assignmentDownloadURL: string;
  openEditParsePage: () => void;
  copySentenceParseNew: () => void;
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
            pitchesArray={accentsForPitchesArray(sentence.accents)}
          />
          {!!sentenceParseNew && (
            <SentenceFormContainer sentenceParseNew={sentenceParseNew} />
          )}
          {!!assignmentSentence && !!assignmentSentence.accents.length && (
            <div
              style={{
                background: '#e2f6f6',
                borderRadius: 4,
                padding: 8,
                display: 'grid',
                rowGap: 8,
              }}
            >
              <div style={{ fontSize: 12, color: '#52a2aa' }}>
                提出アクセント
              </div>
              <SentencePitchLine
                pitchesArray={accentsForPitchesArray(
                  assignmentSentence.accents
                )}
              />
            </div>
          )}
        </div>
        <RowFooter
          sentence={sentence}
          downloadURL={downloadURL}
          assignmentSentence={assignmentSentence}
          assignmentDownloadURL={assignmentDownloadURL}
          openEditParsePage={openEditParsePage}
          copySentenceParseNew={copySentenceParseNew}
        />
      </div>
    </Card>
  );
};

export default SentenceRow;

const SentenceFormContainer = ({
  sentenceParseNew,
}: {
  sentenceParseNew: SentenceParseNew;
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
  return (
    <ComplexSentencePane
      Cursor={null}
      units={units}
      sentences={sentences}
      sentenceArrays={sentenceArrays}
    />
  );
};

const RowFooter = ({
  sentence,
  downloadURL,
  assignmentSentence,
  assignmentDownloadURL,
  openEditParsePage,
  copySentenceParseNew,
}: {
  sentence: Sentence;
  downloadURL: string;
  assignmentSentence: AssignmentSentence | null;
  assignmentDownloadURL: string;
  openEditParsePage: () => void;
  copySentenceParseNew: () => void;
}) => {
  const [openEditSentencePane, setOpenEditSentencePane] = useState(false);
  const [openEditAssignmentPane, setOpenEditAssignmentPane] = useState(false);
  return (
    <div style={{ display: 'grid', rowGap: 16 }}>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
        }}
      >
        <IconButton
          size='small'
          onClick={() => setOpenEditSentencePane(!openEditSentencePane)}
        >
          <Edit />
        </IconButton>
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

        <IconButton size='small' onClick={copySentenceParseNew}>
          <FileCopyOutlined />
        </IconButton>
        {!!assignmentSentence && (
          <IconButton
            size='small'
            onClick={() => setOpenEditAssignmentPane(!openEditAssignmentPane)}
          >
            <Person />
          </IconButton>
        )}
      </div>
      {openEditSentencePane && (
        <EditSentencePane
          sentence={sentence}
          callback={() => setOpenEditSentencePane(false)}
        />
      )}

      {!!assignmentSentence && openEditAssignmentPane && (
        <EditAssignmentPane
          assignmentSentence={assignmentSentence}
          assignmentDownloadURL={assignmentDownloadURL}
          callback={() => setOpenEditAssignmentPane(false)}
        />
      )}
    </div>
  );
};
