import React, { useContext } from 'react';
import { Navigate, useMatch } from 'react-router-dom';
import TableLayout from '../../../components/templates/TableLayout';
import { AppContext } from '../../../services/app';
import SentenceForm from './components/SentenceForm';

const EditArticleSentenceFormPane = () => {
  const match = useMatch('/form/:index');
  const index = Number(match?.params.index || '0');
  const { article, sentences } = useContext(AppContext);
  const sentence = sentences[index];
  if (!!article) {
    return (
      <TableLayout
        title={`${article.title} - 文の形 編集`}
        maxWidth='md'
        backURL={`/article/${article.id}`}
      >
        {!!sentence && <SentenceForm lineIndex={index} sentence={sentence} />}
      </TableLayout>
    );
  }
  return <Navigate to={'/article/list'} />;
};

export default EditArticleSentenceFormPane;
