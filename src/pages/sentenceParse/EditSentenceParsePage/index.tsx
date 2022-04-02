import React, { useContext } from 'react';
import { Navigate, useMatch } from 'react-router-dom';
import { useArticleSentence } from '../../article/EditArticleSentencePage/services/articleSentence';
import SentenceParseForm from './components/SentenceParseForm';
import TableLayout from '../../../components/templates/TableLayout';
import { AppContext } from '../../../services/app';

const EditSentenceParsePage = () => {
  const match = useMatch('/sentence/:id/parse');
  const { isFetching, article } = useContext(AppContext);
  const { sentence } = useArticleSentence({
    id: match?.params.id || '',
  });
  if (isFetching) {
    return <></>;
  } else {
    if (!!article) {
      return (
        <TableLayout
          title={`${article.title} - sentenceParse 編集`}
          backURL={`/article/${article.id}/parse`}
          maxWidth='md'
        >
          {!!sentence && (
            <SentenceParseForm article={article} sentence={sentence} />
          )}
        </TableLayout>
      );
    } else {
      return <Navigate to={`/article/list`} />;
    }
  }
};

export default EditSentenceParsePage;
