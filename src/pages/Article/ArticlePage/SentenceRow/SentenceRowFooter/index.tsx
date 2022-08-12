import AccountTreeIcon from '@mui/icons-material/AccountTree';
import EditIcon from '@mui/icons-material/Edit';
import { IconButton } from '@mui/material';
import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../../../../../App';
import { State } from '../../../../../Model';
import { Action } from '../../../../../Update';
import EditSentencePane from './EditSentencePane';

const SentenceRowFooter = ({ sentenceIndex }: { sentenceIndex: number }) => {
  const { state, dispatch } = useContext(AppContext);
  const { article } = state;
  const { id: articleId } = article;
  const navigate = useNavigate();
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
        <IconButton
          size='small'
          onClick={() => {
            navigate(`/form/${articleId}/index/${sentenceIndex}`);
          }}
        >
          <AccountTreeIcon />
        </IconButton>
      </div>
      {open && (
        <EditSentencePane
          sentenceIndex={sentenceIndex}
          callback={() => setOpen(false)}
        />
      )}
    </div>
  );
};

export default SentenceRowFooter;
