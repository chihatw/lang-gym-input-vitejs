import React from 'react';
import { Navigate, useMatch } from 'react-router-dom';
import { useArticleSentence } from './services/articleSentence';
import TableLayout from '../../../components/templates/TableLayout';
import ArticleSentenceForm from './components/ArticleSentenceForm';

const EditArticleSentencePage = () => {
  const match = useMatch('/sentence/:id');
  const { initializing, article, sentence } = useArticleSentence(
    match?.params.id || ''
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
      return <Navigate to={`/article/list`} />;
    }
  }
};

export default EditArticleSentencePage;
