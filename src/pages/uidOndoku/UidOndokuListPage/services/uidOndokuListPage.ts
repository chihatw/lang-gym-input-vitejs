import {
  onSnapshot,
  query,
  collection,
  orderBy,
  limit,
} from '@firebase/firestore';
import { useContext, useEffect, useState } from 'react';
import { buildUidOndoku, UidOndoku } from '../../../../entities/UidOndoku';
import { db } from '../../../../repositories/firebase';
import { deleteUidOndoku } from '../../../../repositories/uidOndoku';
import { getUser } from '../../../../repositories/user';
import { AppContext } from '../../../../services/app';

const COLLECTION = 'uidOndokus';
const colRef = collection(db, COLLECTION);

export const useUidOndokuListPage = (_limit: number) => {
  const { ondoku } = useContext(AppContext);
  const [uidOndokus, setUidOndokus] = useState<UidOndoku[]>([]);
  const [uids, setUids] = useState<string[]>([]);
  const [ondokuIDs, setOndokuIDs] = useState<string[]>([]);
  const [displaynames, setDisplayNames] = useState<{ [key: string]: string }>(
    {}
  );
  const [titles, setTitles] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    const q = query(colRef, orderBy('createdAt', 'desc'), limit(_limit));
    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        console.log('snapshot uid ondokus');
        if (!snapshot.empty) {
          setUidOndokus(
            snapshot.docs.map((doc) => buildUidOndoku(doc.id, doc.data()))
          );
        }
      },
      (error) => {
        console.warn(error);
      }
    );

    return () => {
      unsubscribe();
    };
  }, [limit]);

  useEffect(() => {
    if (!uidOndokus) return;
    const fetchData = async () => {
      const uids: string[] = [];
      const ondokuIDs: string[] = [];
      uidOndokus.forEach((uo) => {
        uids.push(uo.uid);
        ondokuIDs.push(uo.ondoku.id);
      });
      setUids(uids.filter((item, index) => uids.indexOf(item) === index));
      setOndokuIDs(
        ondokuIDs.filter((item, index) => ondokuIDs.indexOf(item) === index)
      );
    };
    fetchData();
  }, [uidOndokus]);

  useEffect(() => {
    if (!uidOndokus || !uids.length || !ondokuIDs.length) return;
    const fetchData = async () => {
      const displaynames: { [key: string]: string } = {};
      await Promise.all(
        uids.map(async (uid) => {
          const user = await getUser(uid);
          displaynames[uid] = !!user ? user.displayname : '';
        })
      );
      setDisplayNames(displaynames);

      const titles: { [key: string]: string } = {};
      await Promise.all(
        ondokuIDs.map(async (id) => {
          titles[id] = !!ondoku ? ondoku.title : '';
        })
      );
      setTitles(titles);
    };
    fetchData();
  }, [uids, ondokuIDs, uidOndokus, ondoku]);

  const onDelete = (uidOndoku: UidOndoku) => {
    if (
      window.confirm(
        `${displaynames[uidOndoku.uid]}の「${
          titles[uidOndoku.ondoku.id]
        }」を削除しますか`
      )
    ) {
      deleteUidOndoku(uidOndoku.id);
    }
  };

  return { uidOndokus, onDelete, displaynames, titles };
};
