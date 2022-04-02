import React, { useContext } from 'react';
import { Navigate, useMatch } from 'react-router-dom';
import { useArticleSentence } from './services/articleSentence';
import TableLayout from '../../../components/templates/TableLayout';
import ArticleSentenceForm from './components/ArticleSentenceForm';
import { AppContext } from '../../../services/app';

const EditArticleSentencePage = () => {
  const match = useMatch('/sentence/:id');

  const { article, isFetching } = useContext(AppContext);
  const { sentence } = useArticleSentence({ id: match?.params.id || '' });
  if (isFetching) {
    return <></>;
  } else {
    if (!!article) {
      return (
        <TableLayout
          title={`${article.title} - 編集`}
          backURL={`/article/${article.id}`}
        >
          {!!sentence && (
            <ArticleSentenceForm article={article} sentence={sentence} />
          )}
        </TableLayout>
      );
    } else {
      return <Navigate to={`/article/list`} />;
    }
  }
};

export default EditArticleSentencePage;
