import React from 'react';
import { useMatch } from 'react-router-dom';
import { useAccentsQuestionPage } from './services/accentsQuestionPage';
import AccentsQuestionForm from './components/AccentsQuestionForm';
import TableLayout from '../../../../components/templates/TableLayout';
import { State } from '../../../../Model';
import { Action } from '../../../../Update';

const AccentsQuestionPage = ({
  state,
  dispatch,
}: {
  state: State;
  dispatch: React.Dispatch<Action>;
}) => {
  const match = useMatch('/accentsQuestion/:id');
  const { initializing, title, ...props } = useAccentsQuestionPage(
    match?.params.id || ''
  );
  if (initializing) {
    return <></>;
  } else {
    return (
      <TableLayout title={title} backURL='/accentsQuestion/list'>
        <AccentsQuestionForm
          {...props}
          title={title}
          state={state}
          dispatch={dispatch}
        />
      </TableLayout>
    );
  }
};

export default AccentsQuestionPage;
