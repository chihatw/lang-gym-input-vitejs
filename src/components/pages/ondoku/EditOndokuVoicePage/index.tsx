import React from 'react';
import { Redirect, useRouteMatch } from 'react-router-dom';

import AudioEdit from '@bit/chihatw.lang-gym.audio-edit';
import { useEditOndokuVoicePage } from './services/editOndokuVoicePage';
import TableLayout from '../../../templates/TableLayout';

const EditOndokuVoicePage = () => {
  const match = useRouteMatch<{ id: string }>();
  const { title, initializing, ...props } = useEditOndokuVoicePage(
    match.params.id
  );
  if (initializing) {
    return <></>;
  } else {
    if (!props.downloadURL) {
      return <Redirect to={`/ondoku/${match.params.id}/voice/initial`} />;
    } else {
      return (
        <TableLayout title={`${title} - 録音`} backURL={`/ondoku/list`}>
          <AudioEdit {...props} />
        </TableLayout>
      );
    }
  }
};

export default EditOndokuVoicePage;
