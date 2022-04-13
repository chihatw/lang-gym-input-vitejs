import React from 'react';
import { useMatch } from 'react-router-dom';
import { useEditOndokuAssignmentPage } from './services/editOndokuAssignmentPage';
import OndokuAssignmentSentence from './components/OndokuAssignmentSentence';
import TableLayout from '../../../components/templates/TableLayout';

const EditOndokuAssignmentPage = () => {
  const match = useMatch('/ondoku/:id/assignment/uid/:uid/line/:line');
  const { title, ...props } = useEditOndokuAssignmentPage(
    match?.params.id || '',
    match?.params.uid || '',
    Number(match?.params.line || 0)
  );
  return (
    <TableLayout
      title={`${title} - 提出アクセント`}
      backURL={`/ondoku/${match?.params.id}/assignment?uid=${match?.params.uid}`}
    >
      {!!props.sentence && (
        <OndokuAssignmentSentence {...props} sentence={props.sentence} />
      )}
    </TableLayout>
  );
};

export default EditOndokuAssignmentPage;
