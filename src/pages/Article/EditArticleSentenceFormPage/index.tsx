import React, { useContext } from 'react';
import { Navigate, useParams } from 'react-router-dom';
import { AppContext } from '../../../App';
import TableLayout from '../../../components/templates/TableLayout';
import SentenceForm from './SentenceForm';

const EditArticleSentenceFormPane = () => {
  const { state, dispatch } = useContext(AppContext);
  const { index } = useParams();
  const { article, sentences } = state;
  const { title, id: articleId } = article;
  if (index === undefined || !article) return <Navigate to={'/article/list'} />;

  const sentenceIndex = Number(index);
  const sentence = sentences[sentenceIndex];

  return (
    <TableLayout
      title={`${title} - 文の形 編集`}
      maxWidth='md'
      backURL={`/article/${articleId}`}
    >
      {!!sentence && <SentenceForm sentenceIndex={Number(index)} />}
    </TableLayout>
  );
};

export default EditArticleSentenceFormPane;
