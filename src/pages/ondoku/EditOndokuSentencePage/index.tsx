import React from 'react';
import { useMatch } from 'react-router-dom';
import { useEditOndokuSentencePage } from './services/editOndokuSentencePage';
import OndokuSentenceForm from './components/OndokuSentenceForm';
import TableLayout from '../../../components/templates/TableLayout';

const EditOndokuSentencePage = () => {
  const match = useMatch('/ondoku/sentence/:id');
  const { title, ondokuID, ...props } = useEditOndokuSentencePage(
    match?.params.id || ''
  );
  return (
    <TableLayout title={title} backURL={`/ondoku/${ondokuID}`}>
      <OndokuSentenceForm {...props} />
    </TableLayout>
  );
};

export default EditOndokuSentencePage;
