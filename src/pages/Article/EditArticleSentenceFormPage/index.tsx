import React from 'react';
import { Navigate, useParams } from 'react-router-dom';
import TableLayout from '../../../components/templates/TableLayout';
import { State } from '../../../Model';
import { Action } from '../../../Update';
import SentenceForm from './SentenceForm';

const EditArticleSentenceFormPane = ({
  state,
  dispatch,
}: {
  state: State;
  dispatch: React.Dispatch<Action>;
}) => {
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
      {!!sentence && (
        <SentenceForm
          state={state}
          dispatch={dispatch}
          sentenceIndex={Number(index)}
        />
      )}
    </TableLayout>
  );
};

export default EditArticleSentenceFormPane;
