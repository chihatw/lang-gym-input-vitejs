import React from 'react';
import { Navigate, useMatch } from 'react-router-dom';
import { useInitialArticleVoicePage } from './services/initialArticleVoicePage';
import TableLayout from '../../../components/templates/TableLayout';
import { Button } from '@mui/material';

const InitialArticleVoicePage = () => {
  const match = useMatch('/article/:id/voice/initial');
  const { title, initializing, hasSentences, onUpload } =
    useInitialArticleVoicePage(match?.params.id || '');
  if (initializing) {
    return <></>;
  } else {
    if (hasSentences) {
      return (
        <TableLayout title={title} backURL='/article/list'>
          <Button variant='contained' component='label'>
            アップロード
            <input
              aria-label='audio mp3 upload'
              type='file'
              style={{ display: 'none' }}
              onChange={onUpload}
            />
          </Button>
        </TableLayout>
      );
    } else {
      return <Navigate to={`/article/${match?.params.id}/initial`} />;
    }
  }
};

export default InitialArticleVoicePage;
