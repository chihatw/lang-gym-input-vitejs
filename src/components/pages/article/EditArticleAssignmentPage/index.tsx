import React from 'react';
import { useRouteMatch } from 'react-router';
import { useEditArticleAssignmentPage } from './services/editArticleAssignmentPage';
import EditAssignmentSentenceForm from './components/EditAssignmentSentenceForm';
import TableLayout from '../../../templates/TableLayout';

const EditArticleAssignmentPage = () => {
  const match = useRouteMatch<{ id: string; uid: string; line: string }>();
  const { initializing, title, ...props } = useEditArticleAssignmentPage(
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
        backURL={`/article/${match.params.id}/assignment`}
      >
        {!!props.sentence && (
          <EditAssignmentSentenceForm {...props} sentence={props.sentence} />
        )}
      </TableLayout>
    );
  }
};

export default EditArticleAssignmentPage;
