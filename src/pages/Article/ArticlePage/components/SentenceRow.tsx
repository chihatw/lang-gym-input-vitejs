import { SentenceFormPane } from '@chihatw/sentence-form.sentence-form-pane';
import EditIcon from '@mui/icons-material/Edit';
import PersonIcon from '@mui/icons-material/Person';
import AccountTreeIcon from '@mui/icons-material/AccountTree';
import FileCopyOutlinedIcon from '@mui/icons-material/FileCopyOutlined';
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';

import { Card, IconButton } from '@mui/material';
import { SentencePitchLine } from '@chihatw/pitch-line.sentence-pitch-line';
import accentsForPitchesArray from 'accents-for-pitches-array';
import React, { useMemo, useState } from 'react';
import sentenceParseNew2SentenceParseProps from 'sentence-parse-new2sentence-parse-props';

import Speaker from '../../../../components/Speaker';
import EditSentencePane from './EditSentencePane';
import EditAssignmentPane from './EditAssignmentPane';
import { ArticleSentence } from '../../../../services/useSentences';
import { SentenceParseNew } from '../../../../services/useSentenceParseNews';
import { AssignmentSentence } from '../../../../services/useAssignmentSentences';
import { ComplexSentencePane } from '../../../../components/complex-sentence-pane';
import { FSentences } from 'fsentence-types';

const SentenceRow = ({
  isSm,
  sentence,
  sentences,
  downloadURL,
  sentenceParseNew,
  assignmentSentence,
  assignmentDownloadURL,
  openEditParsePage,
  copySentenceParseNew,
  openEditArticleSentenceFormPane,
}: {
  isSm: boolean;
  sentence: ArticleSentence;
  sentences: FSentences;
  downloadURL: string;
  sentenceParseNew: SentenceParseNew | null;
  assignmentSentence: AssignmentSentence | null;
  assignmentDownloadURL: string;
  openEditParsePage: () => void;
  copySentenceParseNew: () => void;
  openEditArticleSentenceFormPane: () => void;
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
            <SentenceFormContainer
              isSm={isSm}
              sentenceParseNew={sentenceParseNew}
            />
          )}
          {!!Object.keys(sentences).length && (
            <SentenceFormPane sentences={sentences} />
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
        <CardFooter
          sentence={sentence}
          downloadURL={downloadURL}
          assignmentSentence={assignmentSentence}
          assignmentDownloadURL={assignmentDownloadURL}
          openEditParsePage={openEditParsePage}
          copySentenceParseNew={copySentenceParseNew}
          openEditArticleSentenceFormPane={openEditArticleSentenceFormPane}
        />
      </div>
    </Card>
  );
};

export default SentenceRow;

const SentenceFormContainer = ({
  isSm,
  sentenceParseNew,
}: {
  isSm: boolean;
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
    <div style={{ maxWidth: isSm ? 500 : 800, overflowX: 'scroll' }}>
      <ComplexSentencePane
        Cursor={null}
        units={units}
        sentences={sentences}
        sentenceArrays={sentenceArrays}
      />
    </div>
  );
};

const CardFooter = ({
  sentence,
  downloadURL,
  assignmentSentence,
  assignmentDownloadURL,
  openEditParsePage,
  copySentenceParseNew,
  openEditArticleSentenceFormPane,
}: {
  sentence: ArticleSentence;
  downloadURL: string;
  assignmentSentence: AssignmentSentence | null;
  assignmentDownloadURL: string;
  openEditParsePage: () => void;
  copySentenceParseNew: () => void;
  openEditArticleSentenceFormPane: () => void;
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
          <EditIcon />
        </IconButton>
        {!!downloadURL && sentence.end - sentence.start > 0 && (
          <Speaker
            end={sentence.end}
            start={sentence.start}
            downloadURL={downloadURL}
          />
        )}

        <IconButton size='small' onClick={openEditParsePage}>
          <SettingsOutlinedIcon />
        </IconButton>

        <IconButton size='small' onClick={copySentenceParseNew}>
          <FileCopyOutlinedIcon />
        </IconButton>
        <span style={{ width: '2em' }} />
        <IconButton size='small' onClick={openEditArticleSentenceFormPane}>
          <AccountTreeIcon />
        </IconButton>
        <IconButton size='small'>
          <FileCopyOutlinedIcon />
        </IconButton>
        {!!assignmentSentence && (
          <IconButton
            size='small'
            onClick={() => setOpenEditAssignmentPane(!openEditAssignmentPane)}
          >
            <PersonIcon />
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
