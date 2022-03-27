import React from 'react';
import { useCreateArticlePage } from './services/createArticlePage';
import ArticleForm from '@bit/chihatw.lang-gym.article-form'; //TODO 内部化
import TableLayout from '../../../templates/TableLayout';

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
