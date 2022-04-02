import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useOndokuListPage } from './services/ondokuListPage';
import OndokuTable from './components/OndokuTable';
import TableLayout from '../../../components/templates/TableLayout';

const OndokuListPage = () => {
  const {
    ondokus,
    onEdit,
    onAddUidOndoku,
    onToggleShowAccents,
    onShowVoice,
    onDelete,
    onShowSentences,
    onShowAssignment,
  } = useOndokuListPage(6);
  const navigate = useNavigate();
  return (
    <TableLayout title='音読一覧' onCreate={() => navigate('/ondoku')}>
      <OndokuTable
        ondokus={ondokus}
        onEdit={onEdit}
        onAddUidOndoku={onAddUidOndoku}
        onToggleShowAccents={onToggleShowAccents}
        onShowVoice={onShowVoice}
        onDelete={onDelete}
        onShowSentences={onShowSentences}
        onShowAssignment={onShowAssignment}
      />
    </TableLayout>
  );
};

export default OndokuListPage;
