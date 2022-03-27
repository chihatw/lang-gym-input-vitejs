import React from 'react';
import { Redirect, useRouteMatch } from 'react-router';
import { ArticlePaneContext, useArticlePage } from './services/articlePage';
import ArticleSentenceList from './components/ArticleSentenceList';
import TableLayout from '../../../templates/TableLayout';

const ArticlePage = () => {
  const match = useRouteMatch<{ id: string }>();
  const { initializing, article, sentences } = useArticlePage(match.params.id);
  if (initializing) {
    return <></>;
  } else {
    if (!!article && !!sentences.length) {
      return (
        <ArticlePaneContext.Provider value={{ article, sentences }}>
          <TableLayout title={article.title} backURL={`/article/list`}>
            <ArticleSentenceList />
          </TableLayout>
        </ArticlePaneContext.Provider>
      );
    } else {
      return <Redirect to={`/article/${match.params.id}/initial`} />;
    }
  }
};

export default ArticlePage;
