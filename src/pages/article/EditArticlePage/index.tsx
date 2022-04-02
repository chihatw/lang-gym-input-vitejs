import React from 'react';
import { useMatch } from 'react-router-dom';

import TableLayout from '../../../components/templates/TableLayout';
import ArticleForm from '../../../components/organisms/ArticleForm';
import { useEditArticlePage } from './services/editArticlePage';

const EditArticlePage = () => {
  const match = useMatch('/article/:id/edit');
  const {
    uid,
    date,
    users,
    title,
    onSubmit,
    onPickDate,
    onChangeUid,
    switchItems,
    textFieldItems,
  } = useEditArticlePage(match?.params.id || '');
  return (
    <TableLayout title={`${title} - 編集`} backURL='/article/list'>
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
