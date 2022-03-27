import { Button } from '@mui/material';
import React from 'react';
import { Redirect, useRouteMatch } from 'react-router';
import { useInitialOndokuVoicePage } from './services/initialOndokuVoicePage';
import TableLayout from '../../../templates/TableLayout';

const InitialOndokuVoicePage = () => {
  const match = useRouteMatch<{ id: string }>();
  const { title, initializing, hasSentences, onUpload } =
    useInitialOndokuVoicePage(match.params.id);
  if (initializing) {
    return <></>;
  } else {
    if (hasSentences) {
      return (
        <TableLayout title={title} backURL='/ondoku/list'>
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
      return <Redirect to={`/ondoku/${match.params.id}/initial`} />;
    }
  }
};

export default InitialOndokuVoicePage;
