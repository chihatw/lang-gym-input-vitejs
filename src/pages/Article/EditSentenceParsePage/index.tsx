import { Navigate, useMatch } from 'react-router-dom';
import React, { useContext, useMemo } from 'react';

import TableLayout from '../../../components/templates/TableLayout';
import { AppContext } from '../../../services/app';
import SentenceParseForm from './components/SentenceParseForm';

const EditSentenceParsePage = () => {
  const match = useMatch('/parse/:index');
  const index = Number(match?.params.index || '0');
  const { article, sentences } = useContext(AppContext);
  const sentence = useMemo(() => sentences[index], [sentences, index]);

  if (!!article) {
    return (
      <TableLayout
        title={`${article.title} - sentenceParse 編集`}
        backURL={`/article/${article.id}`}
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
};

export default EditSentenceParsePage;
