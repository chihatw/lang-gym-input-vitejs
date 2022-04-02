import React, { useContext } from 'react';
import { useArticleAssignmentPage } from './services/articleAssignmentPage';
import ArticleAssignment from './components/ArticleAssignment';
import TableLayout from '../../../components/templates/TableLayout';
import { AppContext } from '../../../services/app';

const ArticleAssignmentPage = () => {
  const { article, isFetching } = useContext(AppContext);
  const { sentences, assignmentSentences, downloadURL, onDelete, onUpload } =
    useArticleAssignmentPage();
  if (isFetching) {
    return <></>;
  } else {
    return (
      <TableLayout
        title={`${article.title} - 提出アクセント`}
        backURL='/article/list'
      >
        <ArticleAssignment
          articleId={article.id}
          sentences={sentences}
          downloadURL={downloadURL}
          assignmentSentences={assignmentSentences}
          onDelete={onDelete}
          onUpload={onUpload}
        />
      </TableLayout>
    );
  }
};

export default ArticleAssignmentPage;
