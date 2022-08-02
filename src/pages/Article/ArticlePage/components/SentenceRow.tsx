import EditIcon from '@mui/icons-material/Edit';
import { useNavigate } from 'react-router-dom';
import AccountTreeIcon from '@mui/icons-material/AccountTree';
import { SentenceFormPane } from '@chihatw/sentence-form.sentence-form-pane';
import { Card, IconButton } from '@mui/material';
import { SentencePitchLine } from '@chihatw/pitch-line.sentence-pitch-line';
import accentsForPitchesArray from 'accents-for-pitches-array';
import React, { useState } from 'react';

import Speaker from '../../../../components/Speaker';
import EditSentencePane from './EditSentencePane';

import { State } from '../../../../Model';
import { Action } from '../../../../Update';

const SentenceRow = ({
  isSm,
  state,
  sentenceIndex,
  dispatch,
}: {
  isSm: boolean;
  state: State;
  sentenceIndex: number;
  dispatch: React.Dispatch<Action>;
}) => {
  const { sentences: articleSentences, articleSentenceForms } = state;
  const sentence = articleSentences[sentenceIndex];
  const { line, original, chinese, accents, japanese } = sentence;

  const articleSentenceForm = articleSentenceForms[sentenceIndex];
  const { sentences } = articleSentenceForm;
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
          <div style={{ userSelect: 'none' }}>{`${line + 1}. ${japanese}`}</div>
          <div style={{ color: '#aaa' }}>{original}</div>
          <div style={{ color: '#52a2aa' }}>{chinese}</div>
          <SentencePitchLine pitchesArray={accentsForPitchesArray(accents)} />
          {!!Object.keys(sentences).length && (
            <div style={{ maxWidth: isSm ? 500 : 800, overflowX: 'scroll' }}>
              <SentenceFormPane sentences={sentences} />
            </div>
          )}
        </div>
        <CardFooter
          state={state}
          sentenceIndex={sentenceIndex}
          dispatch={dispatch}
        />
      </div>
    </Card>
  );
};

export default SentenceRow;

const CardFooter = ({
  state,
  dispatch,
  sentenceIndex,
}: {
  state: State;
  dispatch: React.Dispatch<Action>;
  sentenceIndex: number;
}) => {
  const navigate = useNavigate();
  const { sentences: articleSentences, article } = state;
  const { downloadURL } = article;
  const sentence = articleSentences[sentenceIndex];
  const { start, end } = sentence;
  const [open, setOpen] = useState(false);
  return (
    <div style={{ display: 'grid', rowGap: 16 }}>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
        }}
      >
        <IconButton size='small' onClick={() => setOpen(!open)}>
          <EditIcon />
        </IconButton>
        {!!downloadURL && end - start > 0 && (
          <Speaker end={end} start={start} downloadURL={downloadURL} />
        )}
        <span style={{ width: '2em' }} />
        <IconButton
          size='small'
          onClick={() => {
            navigate(`/form/${sentenceIndex}`);
          }}
        >
          <AccountTreeIcon />
        </IconButton>
      </div>
      {open && (
        <EditSentencePane
          state={state}
          dispatch={dispatch}
          sentenceIndex={sentenceIndex}
          callback={() => setOpen(false)}
        />
      )}
    </div>
  );
};
