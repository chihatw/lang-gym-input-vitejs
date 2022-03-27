import React from 'react';
import { useRouteMatch } from 'react-router';

import TableLayout from '../../../templates/TableLayout';
import ArticleForm from '../../../organisms/ArticleForm';
import { useEditArticlePage } from './services/editArticlePage';

const EditArticlePage = () => {
  const match = useRouteMatch<{ id: string }>();
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
  } = useEditArticlePage(match.params.id);
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
