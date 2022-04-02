import React from 'react';
import { useMatch } from 'react-router-dom';
import { useOndokuAssignmentPage } from './services/ondokuAssignmentPage';
import OndokuAssignment from './components/OndokuAssignment';
import TableLayout from '../../../components/templates/TableLayout';

const OndokuAssignmentPage = () => {
  const match = useMatch('/ondoku/:id/assignment');
  const {
    initializing,
    ondoku,
    users,
    onChangeUid,
    sentences,
    assignment,
    assignmentSentences,
    onDelete,
    onUpload,
  } = useOndokuAssignmentPage(match?.params.id || '');
  if (initializing) {
    return <></>;
  } else {
    return (
      <TableLayout
        title={`${ondoku?.title} - 提出アクセント`}
        backURL='/ondoku/list'
      >
        <OndokuAssignment
          users={users}
          sentences={sentences}
          downloadURL={assignment?.downloadURL || ''}
          assignmentSentences={assignmentSentences}
          onDelete={onDelete}
          onUpload={onUpload}
          onChangeUid={onChangeUid}
        />
      </TableLayout>
    );
  }
};

export default OndokuAssignmentPage;
