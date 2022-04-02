import React from 'react';
import { useUidOndokuListPage } from './services/uidOndokuListPage';
import UidOndokuTable from './components/UidOndokuTable';
import TableLayout from '../../../components/templates/TableLayout';

const UidOndokuListPage = () => {
  const { uidOndokus, onDelete, displaynames, titles } =
    useUidOndokuListPage(4);
  return (
    <TableLayout title='ユーザー音読一覧'>
      <UidOndokuTable
        uidOndokus={uidOndokus}
        onDelete={onDelete}
        displaynames={displaynames}
        titles={titles}
      />
    </TableLayout>
  );
};

export default UidOndokuListPage;
