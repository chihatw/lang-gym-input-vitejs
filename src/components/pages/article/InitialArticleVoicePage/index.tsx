import React from 'react';
import { Redirect, useRouteMatch } from 'react-router';
import { useInitialArticleVoicePage } from './services/initialArticleVoicePage';
import TableLayout from '../../../templates/TableLayout';
import { Button } from '@mui/material';

const InitialArticleVoicePage = () => {
  const match = useRouteMatch<{ id: string }>();
  const { title, initializing, hasSentences, onUpload } =
    useInitialArticleVoicePage(match.params.id);
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
      return <Redirect to={`/article/${match.params.id}/initial`} />;
    }
  }
};

export default InitialArticleVoicePage;
