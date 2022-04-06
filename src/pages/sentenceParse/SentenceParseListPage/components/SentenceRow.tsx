import React from 'react';
import { Divider, IconButton } from '@mui/material';
import { Edit, FileCopyOutlined } from '@mui/icons-material';

import { Sentence } from '../../../../entities/Sentence';
import SentenceParsePane from './SentenceParsePane';
import { SentenceParseNew } from '../../../../entities/SentenceParseNew';

const SentenceRow = ({
  index,
  hasNext,
  sentence,
  sentenceParseNew,
  onCopy,
  openEditPage,
}: {
  index: number;
  hasNext: boolean;
  sentence: Sentence;
  sentenceParseNew?: SentenceParseNew;
  onCopy: () => void;
  openEditPage: () => void;
}) => (
  <div
    style={{
      color: '#555',
      padding: '16px 16px 8px',
      fontSize: 12,
    }}
  >
    <div style={{ fontSize: 18, marginBottom: 8 }}>{`${index + 1} .`}</div>

    <div>{sentence.japanese}</div>
    <div style={{ color: '#aaa' }}>{sentence.original}</div>
    <div style={{ color: 'orange' }}>{sentence.chinese}</div>
    <div style={{ padding: '8px' }}>
      {!!sentenceParseNew && (
        <SentenceParsePane sentenceParseNew={sentenceParseNew} />
      )}
    </div>
    <div
      style={{
        display: 'flex',
        justifyContent: 'flex-start',
        alignItems: 'center',
      }}
    >
      <div>
        <IconButton size='small' onClick={openEditPage}>
          <Edit />
        </IconButton>
      </div>
      <div style={{ width: 8 }} />
      <div>
        <IconButton size='small' onClick={onCopy}>
          <FileCopyOutlined />
        </IconButton>
      </div>
    </div>
  </div>
);

export default SentenceRow;
