import React, { useContext } from 'react';

import { useEditArticleAssignmentVoicePage } from './services/editArticleAssignmentVoicePage';
import ArticleAssignmentVoice from './components/ArticleAssignmentVoice';
import TableLayout from '../../../components/templates/TableLayout';
import { AppContext } from '../../../services/app';

const EditArticleAssignmentVoicePage = () => {
  const { article, isFetching } = useContext(AppContext);
  const { sentences, ...props } = useEditArticleAssignmentVoicePage({
    id: article.id,
    uid: article.uid,
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
