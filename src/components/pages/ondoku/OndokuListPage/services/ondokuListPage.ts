import {
  query,
  onSnapshot,
  collection,
  orderBy,
  limit,
} from '@firebase/firestore';

import { useEffect, useState } from 'react';
import { deleteOndoku, updateOndoku } from '../../../../../repositories/ondoku';
import { useHistory } from 'react-router-dom';
import { buildOndoku, Ondoku } from '../../../../../entities/Ondoku';
import { db } from '../../../../../repositories/firebase';
import { deleteOndokuSentences } from '../../../../../repositories/ondokuSentence';
import { deleteFile } from '../../../../../repositories/file';

const COLLECTION = 'ondokus';
const ondokusRef = collection(db, 'ondokus');

export const useOndokuListPage = (_limit: number) => {
  const history = useHistory();

  const [ondokus, setOndokus] = useState<Ondoku[]>([]);
  useEffect(() => {
    const q = query(ondokusRef, orderBy('createdAt', 'desc'), limit(_limit));
    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        console.log('snapshot ondoku');
        const ondokus = snapshot.docs.map((doc) =>
          buildOndoku(doc.id, doc.data())
        );
        setOndokus(ondokus);
      },
      (e) => {
        console.warn(e);
      }
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
