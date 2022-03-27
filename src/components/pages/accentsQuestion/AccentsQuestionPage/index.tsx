import React from 'react';
import { useRouteMatch } from 'react-router-dom';
import { useAccentsQuestionPage } from './services/accentsQuestionPage';
import AccentsQuestionForm from './components/AccentsQuestionForm';
import TableLayout from '../../../templates/TableLayout';

const AccentsQuestionPage = () => {
  const match = useRouteMatch<{ id: string }>();
  const { initializing, title, ...props } = useAccentsQuestionPage(
    match.params.id
  );
  if (initializing) {
    return <></>;
  } else {
    return (
      <TableLayout title={title} backURL='/accentsQuestion/list'>
        <AccentsQuestionForm {...props} title={title} />
      </TableLayout>
    );
  }
};

export default AccentsQuestionPage;
