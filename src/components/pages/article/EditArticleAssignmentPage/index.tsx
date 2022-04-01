import React from 'react';
import { useMatch } from 'react-router-dom';
import { useEditArticleAssignmentPage } from './services/editArticleAssignmentPage';
import EditAssignmentSentenceForm from './components/EditAssignmentSentenceForm';
import TableLayout from '../../../templates/TableLayout';

const EditArticleAssignmentPage = () => {
  const match = useMatch('/article/:id/assignment/uid/:uid/line/:line');
  const { initializing, title, ...props } = useEditArticleAssignmentPage(
    match?.params.id || '',
    match?.params.uid || '',
    Number(match?.params.line || 0)
  );
  if (initializing) {
    return <></>;
  } else {
    return (
      <TableLayout
        title={`${title} - 提出アクセント`}
        backURL={`/article/${match?.params.id}/assignment`}
      >
        {!!props.sentence && (
          <EditAssignmentSentenceForm {...props} sentence={props.sentence} />
        )}
      </TableLayout>
    );
  }
};

export default EditArticleAssignmentPage;
