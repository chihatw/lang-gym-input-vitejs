import React from 'react';
import { Navigate, useMatch } from 'react-router-dom';

import AudioEdit from '@bit/chihatw.lang-gym.audio-edit'; // TODO　内部化
import TableLayout from '../../../components/templates/TableLayout';
import { useEditOndokuVoicePage } from './services/editOndokuVoicePage';

const EditOndokuVoicePage = () => {
  const match = useMatch('/ondoku/:id/voice');
  const { title, initializing, ...props } = useEditOndokuVoicePage(
    match?.params.id || ''
  );
  if (initializing) {
    return <></>;
  } else {
    if (!props.downloadURL) {
      return <Navigate to={`/ondoku/${match?.params.id}/voice/initial`} />;
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
