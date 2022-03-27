import React from 'react';
import { useRouteMatch } from 'react-router';
import { useEditArticleAssignmentVoicePage } from './services/editArticleAssignmentVoicePage';
import ArticleAssignmentVoice from './components/ArticleAssignmentVoice';
import TableLayout from '../../../templates/TableLayout';

const EditArticleAssignmentVoicePage = () => {
  const match = useRouteMatch<{ id: string; uid: string }>();
  const { initializing, title, sentences, ...props } =
    useEditArticleAssignmentVoicePage(match.params.id, match.params.uid);
  if (initializing) {
    return <></>;
  } else {
    return (
      <TableLayout title={`${title} - 提出音声`} backURL='/article/list'>
        <ArticleAssignmentVoice sentences={sentences} {...props} />
      </TableLayout>
    );
  }
};

export default EditArticleAssignmentVoicePage;
