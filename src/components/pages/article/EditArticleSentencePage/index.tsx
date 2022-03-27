import React from 'react';
import { Redirect, useRouteMatch } from 'react-router-dom';
import { useArticleSentence } from './services/articleSentence';
import TableLayout from '../../../templates/TableLayout';
import ArticleSentenceForm from './components/ArticleSentenceForm';

const EditArticleSentencePage = () => {
  const match = useRouteMatch<{ id: string }>();
  const { initializing, article, sentence } = useArticleSentence(
    match.params.id
  );
  if (initializing) {
    return <></>;
  } else {
    if (!!article && !!sentence) {
      return (
        <TableLayout
          title={`${article.title} - 編集`}
          backURL={`/article/${article.id}`}
        >
          <ArticleSentenceForm article={article} sentence={sentence} />
        </TableLayout>
      );
    } else {
      return <Redirect to={`/article/list`} />;
    }
  }
};

export default EditArticleSentencePage;
