import React from 'react';
import { useRouteMatch } from 'react-router';
import { useEditOndokuAssignmentVoicePage } from './services/editOndokuAssignmentVoicePage';
import OndokuAssignmentVoice from './components/OndokuAssignmentVoice';
import TableLayout from '../../../templates/TableLayout';

const EditOndokuAssignmentVoicePage = () => {
  const match = useRouteMatch<{ id: string; uid: string }>();
  const { initializing, title, sentences, ...props } =
    useEditOndokuAssignmentVoicePage(match.params.id, match.params.uid);
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
