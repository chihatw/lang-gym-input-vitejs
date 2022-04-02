import React, { useContext, useEffect } from 'react';

import { useMatch } from 'react-router-dom';
import { useEditArticleAssignmentVoicePage } from './services/editArticleAssignmentVoicePage';
import ArticleAssignmentVoice from './components/ArticleAssignmentVoice';
import TableLayout from '../../../components/templates/TableLayout';
import { AppContext } from '../../../services/app';

const EditArticleAssignmentVoicePage = () => {
  const match = useMatch('/article/:id/assignment/uid/:uid/voice/');
  const { article, isFetching } = useContext(AppContext);
  const { sentences, ...props } = useEditArticleAssignmentVoicePage({
    id: article.id,
    uid: match?.params.uid || '',
    article,
  });
  if (isFetching) {
    return <></>;
  } else {
    return (
      <TableLayout
        title={`${article.title} - 提出音声`}
        backURL='/article/list'
      >
        <ArticleAssignmentVoice sentences={sentences} {...props} />
      </TableLayout>
    );
  }
};

export default EditArticleAssignmentVoicePage;
