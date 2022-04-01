import React from 'react';
import { useMatch } from 'react-router-dom';

import TableLayout from '../../../templates/TableLayout';
import CreateUidOndoku from './components/CreateUidOndoku';
import { useCreateUidOndokuPage } from './services/createUidOndokuPage';

const CreateUidOndokuPage = () => {
  const match = useMatch('/uidOndoku/:id');
  const { initializing, title, ...props } = useCreateUidOndokuPage(
    match?.params.id || '',
    5
  );
  if (initializing) {
    return <></>;
  } else {
    return (
      <TableLayout title={`${title} - ユーザー音読作成`} backURL='/ondoku/list'>
        <CreateUidOndoku {...props} />
      </TableLayout>
    );
  }
};

export default CreateUidOndokuPage;
