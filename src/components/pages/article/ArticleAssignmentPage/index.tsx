import React from 'react';
import { useRouteMatch } from 'react-router';
import { useArticleAssignmentPage } from './services/articleAssignmentPage';
import ArticleAssignment from './components/ArticleAssignment';
import TableLayout from '../../../templates/TableLayout';

const ArticleAssignmentPage = () => {
  const match = useRouteMatch<{ id: string; uid: string }>();
  const {
    initializing,
    title,
    sentences,
    downloadURL,
    assignmentSentences,
    onDelete,
    onUpload,
  } = useArticleAssignmentPage(match.params.id);
  if (initializing) {
    return <></>;
  } else {
    return (
      <TableLayout title={`${title} - 提出アクセント`} backURL='/article/list'>
        <ArticleAssignment
          sentences={sentences}
          assignmentSentences={assignmentSentences}
          downloadURL={downloadURL}
          onDelete={onDelete}
          onUpload={onUpload}
        />
      </TableLayout>
    );
  }
};

export default ArticleAssignmentPage;
