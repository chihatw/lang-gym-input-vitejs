import React, { useContext } from 'react';

import TableLayout from '../../../components/templates/TableLayout';
import ArticleForm from '../../../components/organisms/ArticleForm';
import { useEditArticlePage } from './services/editArticlePage';
import { AppContext } from '../../../services/app';

const EditArticlePage = () => {
  const { article } = useContext(AppContext);
  const {
    uid,
    date,
    users,
    onSubmit,
    onPickDate,
    onChangeUid,
    switchItems,
    textFieldItems,
  } = useEditArticlePage({ article });

  return (
    <TableLayout title={`${article.title} - 編集`} backURL='/article/list'>
      <ArticleForm
        uid={uid}
        date={date}
        users={users}
        onSubmit={onSubmit}
        onPickDate={onPickDate}
        onChangeUid={onChangeUid}
        switchItems={switchItems}
        textFieldItems={textFieldItems}
      />
    </TableLayout>
  );
};

export default EditArticlePage;
