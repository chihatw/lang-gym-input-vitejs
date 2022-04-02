import React from 'react';
import { useMatch } from 'react-router-dom';
import { useAccentsQuestionPage } from './services/accentsQuestionPage';
import AccentsQuestionForm from './components/AccentsQuestionForm';
import TableLayout from '../../../components/templates/TableLayout';

const AccentsQuestionPage = () => {
  const match = useMatch('/accentsQuestion/:id');
  const { initializing, title, ...props } = useAccentsQuestionPage(
    match?.params.id || ''
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
