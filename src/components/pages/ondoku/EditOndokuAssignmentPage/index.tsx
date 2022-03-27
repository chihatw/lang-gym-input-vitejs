import React from 'react';
import { useRouteMatch } from 'react-router-dom';
import { useEditOndokuAssignmentPage } from './services/editOndokuAssignmentPage';
import OndokuAssignmentSentence from './components/OndokuAssignmentSentence';
import TableLayout from '../../../templates/TableLayout';

const EditOndokuAssignmentPage = () => {
  const match = useRouteMatch<{ id: string; uid: string; line: string }>();
  const { initializing, title, ...props } = useEditOndokuAssignmentPage(
    match.params.id,
    match.params.uid,
    Number(match.params.line)
  );
  if (initializing) {
    return <></>;
  } else {
    return (
      <TableLayout
        title={`${title} - 提出アクセント`}
        backURL={`/ondoku/${match.params.id}/assignment?uid=${match.params.uid}`}
      >
        {!!props.sentence && (
          <OndokuAssignmentSentence {...props} sentence={props.sentence} />
        )}
      </TableLayout>
    );
  }
};

export default EditOndokuAssignmentPage;
