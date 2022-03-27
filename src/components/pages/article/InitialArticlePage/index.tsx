import React from 'react';
import { useRouteMatch } from 'react-router';
import { useInitialArticlePage } from './services/initialArticlePage';
import TableLayout from '../../../templates/TableLayout';
import ArticleSentenceInitialForm from './components/ArticleSentenceInitialForm';
const InitialArticlePage = () => {
  const match = useRouteMatch<{ id: string }>();
  const { title, initializing, ...props } = useInitialArticlePage(
    match.params.id
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
