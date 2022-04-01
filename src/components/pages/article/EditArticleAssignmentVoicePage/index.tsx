import React from 'react';
import { useMatch } from 'react-router-dom';
import { useEditArticleAssignmentVoicePage } from './services/editArticleAssignmentVoicePage';
import ArticleAssignmentVoice from './components/ArticleAssignmentVoice';
import TableLayout from '../../../templates/TableLayout';

const EditArticleAssignmentVoicePage = () => {
  const match = useMatch('/article/:id/assignment/uid/:uid/voice/');
  const { initializing, title, sentences, ...props } =
    useEditArticleAssignmentVoicePage(
      match?.params.id || '',
      match?.params.uid || ''
    );
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
