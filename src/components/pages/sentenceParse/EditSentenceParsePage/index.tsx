import React from 'react';
import { Redirect, useRouteMatch } from 'react-router';
import { useArticleSentence } from '../../article/EditArticleSentencePage/services/articleSentence';
import SentenceParseForm from './components/SentenceParseForm';
import TableLayout from '../../../templates/TableLayout';

const EditSentenceParsePage = () => {
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
          title={`${article.title} - sentenceParse 編集`}
          backURL={`/article/${article.id}/parse`}
          maxWidth='md'
        >
          <SentenceParseForm article={article} sentence={sentence} />
        </TableLayout>
      );
    } else {
      return <Redirect to={`/article/list`} />;
    }
  }
};

export default EditSentenceParsePage;
