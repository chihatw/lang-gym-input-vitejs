import { Button } from '@mui/material';
import { Navigate } from 'react-router-dom';
import React, { useContext } from 'react';

import TableLayout from '../../../components/templates/TableLayout';
import { AppContext } from '../../../services/app';
import { useInitialArticleVoicePage } from './services/initialArticleVoicePage';

const InitialArticleVoicePage = () => {
  const { article, isFetching } = useContext(AppContext);
  const { hasSentences, onUpload } = useInitialArticleVoicePage({
    article,
  });
  if (isFetching) {
    return <></>;
  } else {
    if (hasSentences) {
      return (
        <TableLayout title={article.title} backURL='/article/list'>
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
      return <Navigate to={`/article/${article.id}/initial`} />;
    }
  }
};

export default InitialArticleVoicePage;
