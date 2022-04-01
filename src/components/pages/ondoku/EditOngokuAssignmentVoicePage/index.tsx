import React from 'react';
import { useMatch } from 'react-router-dom';
import { useEditOndokuAssignmentVoicePage } from './services/editOndokuAssignmentVoicePage';
import OndokuAssignmentVoice from './components/OndokuAssignmentVoice';
import TableLayout from '../../../templates/TableLayout';

const EditOndokuAssignmentVoicePage = () => {
  const match = useMatch('/ondoku/:id/assignment/uid/:uid/voice/');
  const { initializing, title, sentences, ...props } =
    useEditOndokuAssignmentVoicePage(
      match?.params.id || '',
      match?.params.uid || ''
    );
  if (initializing) {
    return <></>;
  } else {
    return (
      <TableLayout title={`${title} - 提出音声`} backURL='/ondoku/list'>
        <OndokuAssignmentVoice sentences={sentences} {...props} />
      </TableLayout>
    );
  }
};

export default EditOndokuAssignmentVoicePage;
