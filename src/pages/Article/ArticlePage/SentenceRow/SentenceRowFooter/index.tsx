import AccountTreeIcon from '@mui/icons-material/AccountTree';
import EditIcon from '@mui/icons-material/Edit';
import { IconButton } from '@mui/material';
import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../../../../../App';
import { ArticleSentence, State } from '../../../../../Model';
import { Action } from '../../../../../Update';
import EditSentencePane from './EditSentencePane';

const SentenceRowFooter = ({
  blob,
  articleId,
  sentence,
}: {
  blob: Blob | null;
  articleId: string;
  sentence: ArticleSentence;
}) => {
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
        <span style={{ width: '2em' }} />
      </div>
      {open && (
        <EditSentencePane
          articleId={articleId}
          blob={blob}
          sentence={sentence}
          callback={() => setOpen(false)}
        />
      )}
    </div>
  );
};

export default SentenceRowFooter;
