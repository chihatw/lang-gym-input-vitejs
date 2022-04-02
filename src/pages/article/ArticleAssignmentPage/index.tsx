import React from 'react';
import { useMatch } from 'react-router-dom';
import { useArticleAssignmentPage } from './services/articleAssignmentPage';
import ArticleAssignment from './components/ArticleAssignment';
import TableLayout from '../../../components/templates/TableLayout';

const ArticleAssignmentPage = () => {
  const match = useMatch('/article/:id/assignment');
  const {
    initializing,
    title,
    sentences,
    downloadURL,
    assignmentSentences,
    onDelete,
    onUpload,
  } = useArticleAssignmentPage(match?.params.id || '');
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
