import React from 'react';
import { useRouteMatch } from 'react-router-dom';
import { useCreateUidOndokuPage } from './services/createUidOndokuPage';
import CreateUidOndoku from './components/CreateUidOndoku';
import TableLayout from '../../../templates/TableLayout';

const CreateUidOndokuPage = () => {
  const match = useRouteMatch<{ id: string }>();
  const { initializing, title, ...props } = useCreateUidOndokuPage(
    match.params.id,
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
