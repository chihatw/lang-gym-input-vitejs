import { Navigate } from 'react-router-dom';
import React, { useContext } from 'react';
import { ArticlePaneContext, useArticlePage } from './services/articlePage';

import TableLayout from '../../../components/templates/TableLayout';
import { AppContext } from '../../../services/app';
import ArticleSentenceList from './components/ArticleSentenceList';

const ArticlePage = () => {
  const { article, isFetching } = useContext(AppContext);

  const { sentences } = useArticlePage(article.id);

  // データ取得中
  if (isFetching) {
    return <></>;
  } else {
    if (!!article.id) {
      return (
        <ArticlePaneContext.Provider value={{ article, sentences }}>
          <TableLayout title={article.title} backURL={`/article/list`}>
            <ArticleSentenceList />
          </TableLayout>
        </ArticlePaneContext.Provider>
      );
    }
    // article が 初期値
    else {
      return <Navigate to={'/article/list'} />;
    }
  }
};

export default ArticlePage;
