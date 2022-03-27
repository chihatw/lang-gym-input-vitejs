import React from 'react';

import TableLayout from '../../../templates/TableLayout';
import ArticleForm from '../../../organisms/ArticleForm';
import { useCreateArticlePage } from './services/createArticlePage';

const CreateArticlePage = () => {
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
  } = useCreateArticlePage();
  return (
    <TableLayout title={`${title} - 新規`} backURL='/article/list'>
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

export default CreateArticlePage;
