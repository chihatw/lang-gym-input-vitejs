import { useEffect, useState } from 'react';
import { deleteOndoku, updateOndoku } from '../../../../../repositories/ondoku';
import { useHistory } from 'react-router-dom';
import { buildOndoku, Ondoku } from '../../../../../entities/Ondoku';
import { db } from '../../../../../repositories/firebase';
import { deleteOndokuSentences } from '../../../../../repositories/ondokuSentence';
import { deleteFile } from '../../../../../repositories/file';
export const useOndokuListPage = (limit: number) => {
  const history = useHistory();
  const ondokusRef = db.collection('ondokus');
  const [ondokus, setOndokus] = useState<Ondoku[]>([]);
  useEffect(() => {
    const unsubscribe = ondokusRef
      .orderBy('createdAt', 'desc')
      .limit(limit)
      .onSnapshot(
        (snapshot) => {
          console.log('snapshot ondoku');
          const ondokus = snapshot.docs.map((doc) =>
            buildOndoku(doc.id, doc.data())
          );
          setOndokus(ondokus);
        },
        (error) => {}
      );

    return () => {
      unsubscribe();
    };
    // eslint-disable-next-line
  }, []);
  const onEdit = (ondoku: Ondoku) => {
    history.push(`/ondoku/edit/${ondoku.id}`);
  };
  const onAddUidOndoku = (ondoku: Ondoku) => {
    history.push(`/uidOndoku/${ondoku.id}`);
  };
  const onToggleShowAccents = async (ondoku: Ondoku) => {
    const newOndoku: Ondoku = {
      ...ondoku,
      isShowAccents: !ondoku.isShowAccents,
    };
    await updateOndoku(newOndoku);
  };
  const onShowVoice = (ondoku: Ondoku) => {
    history.push(`/ondoku/${ondoku.id}/voice`);
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
    history.push(`/ondoku/${ondoku.id}`);
  };

  const onShowAssignment = (ondoku: Ondoku) => {
    history.push(`/ondoku/${ondoku.id}/assignment`);
  };

  return {
    ondokus,
    onEdit,
    onAddUidOndoku,
    onToggleShowAccents,
    onShowVoice,
    onDelete,
    onShowSentences,
    onShowAssignment,
  };
};
