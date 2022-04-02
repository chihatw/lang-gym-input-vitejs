import React, { useContext } from 'react';
import { useMatch } from 'react-router-dom';
import { useEditArticleAssignmentPage } from './services/editArticleAssignmentPage';
import EditAssignmentSentenceForm from './components/EditAssignmentSentenceForm';
import TableLayout from '../../../components/templates/TableLayout';
import { AppContext } from '../../../services/app';

const EditArticleAssignmentPage = () => {
  const match = useMatch('/article/:id/assignment/uid/:uid/line/:line');
  const { article, isFetching } = useContext(AppContext);
  const { ...props } = useEditArticleAssignmentPage(
    article.id,
    match?.params.uid || '',
    Number(match?.params.line || 0)
  );
  if (isFetching) {
    return <></>;
  } else {
    return (
      <TableLayout
        title={`${article.title} - 提出アクセント`}
        backURL={`/article/${article.id}/assignment`}
      >
        {!!props.sentence && (
          <EditAssignmentSentenceForm {...props} sentence={props.sentence} />
        )}
      </TableLayout>
    );
  }
};

export default EditArticleAssignmentPage;
