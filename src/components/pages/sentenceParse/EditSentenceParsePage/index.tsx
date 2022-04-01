import React from 'react';
import { Navigate, useMatch } from 'react-router-dom';
import { useArticleSentence } from '../../article/EditArticleSentencePage/services/articleSentence';
import SentenceParseForm from './components/SentenceParseForm';
import TableLayout from '../../../templates/TableLayout';

const EditSentenceParsePage = () => {
  const match = useMatch('/sentence/:id/parse');
  const { initializing, article, sentence } = useArticleSentence(
    match?.params.id || ''
  );
  if (initializing) {
    return <></>;
  } else {
    if (!!article && !!sentence) {
      return (
        <TableLayout
          title={`${article.title} - sentenceParse 編集`}
          backURL={`/article/${article.id}/parse`}
          maxWidth='md'
        >
          <SentenceParseForm article={article} sentence={sentence} />
        </TableLayout>
      );
    } else {
      return <Navigate to={`/article/list`} />;
    }
  }
};

export default EditSentenceParsePage;
