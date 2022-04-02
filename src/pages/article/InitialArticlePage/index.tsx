import React from 'react';
import { useMatch } from 'react-router-dom';
import { useInitialArticlePage } from './services/initialArticlePage';
import TableLayout from '../../../components/templates/TableLayout';
import ArticleSentenceInitialForm from './components/ArticleSentenceInitialForm';
// create ArticlePage の後
const InitialArticlePage = () => {
  const match = useMatch('/article/:id/initial');
  const { title, initializing, ...props } = useInitialArticlePage(
    match?.params.id || ''
  );
  if (initializing) {
    return <></>;
  } else {
    return (
      <TableLayout title={`${title} - 初期化`} backURL='/article/list'>
        <ArticleSentenceInitialForm {...props} />
      </TableLayout>
    );
  }
};

export default InitialArticlePage;
