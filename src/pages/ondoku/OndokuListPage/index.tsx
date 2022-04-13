import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import OndokuTable from './components/OndokuTable';
import TableLayout from '../../../components/templates/TableLayout';
import { AppContext } from '../../../services/app';
import { Ondoku, useHandleOndokus } from '../../../services/useOndokus';
import { deleteFile } from '../../../repositories/file';
import { useHandleOndokuSentences } from '../../../services/useOndokuSentences';

const OndokuListPage = () => {
  const navigate = useNavigate();
  const { ondokus, setOndokuId } = useContext(AppContext);
  const { updateOndoku, deleteOndoku } = useHandleOndokus();
  const { deleteOndokuSentences } = useHandleOndokuSentences();

  const onEdit = (ondoku: Ondoku) => {
    setOndokuId(ondoku.id);
    navigate(`/ondoku/edit/${ondoku.id}`);
  };
  const onAddUidOndoku = (ondoku: Ondoku) => {
    setOndokuId(ondoku.id);
    navigate(`/uidOndoku/${ondoku.id}`);
  };
  const onToggleShowAccents = async (ondoku: Ondoku) => {
    const newOndoku: Ondoku = {
      ...ondoku,
      isShowAccents: !ondoku.isShowAccents,
    };
    updateOndoku(newOndoku);
  };
  const onShowVoice = (ondoku: Ondoku) => {
    setOndokuId(ondoku.id);
    navigate(`/ondoku/${ondoku.id}/voice`);
  };
  const onDelete = async (ondoku: Ondoku) => {
    if (window.confirm(`${ondoku.title}を削除しますか`)) {
      if (ondoku.downloadURL) {
        const path = decodeURIComponent(
          ondoku.downloadURL.split('/')[7].split('?')[0]
        );
        await deleteFile(path);
      }
      await deleteOndokuSentences(ondoku.id);
      await deleteOndoku(ondoku.id);
    }
  };
  const onShowSentences = (ondoku: Ondoku) => {
    setOndokuId(ondoku.id);
    navigate(`/ondoku/${ondoku.id}`);
  };

  const onShowAssignment = (ondoku: Ondoku) => {
    setOndokuId(ondoku.id);
    navigate(`/ondoku/${ondoku.id}/assignment`);
  };

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
