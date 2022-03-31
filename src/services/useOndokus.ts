import { useEffect, useState } from 'react';
import {
  doc,
  limit,
  query,
  getDoc,
  orderBy,
  updateDoc,
  deleteDoc,
  collection,
  onSnapshot,
} from '@firebase/firestore';

import { db } from '../repositories/firebase';

export type Ondoku = {
  id: string;
  title: string;
  createdAt: number;
  downloadURL: string;
  isShowAccents: boolean;
};

export const INITIAL_ONDOKU: Ondoku = {
  id: '',
  title: '',
  createdAt: 0,
  downloadURL: '',
  isShowAccents: false,
};

const LIMIT = 6;
const COLLECTION = 'ondokus';

const colRef = collection(db, COLLECTION);

export const useOndokus = ({
  opened,
  ondokuId,
  isFetchingRef,
}: {
  opened: boolean;
  ondokuId: string;
  isFetchingRef: React.MutableRefObject<boolean>;
}) => {
  const [ondoku, setOndoku] = useState(INITIAL_ONDOKU);
  const [ondokus, setOndokus] = useState<Ondoku[]>([]);

  useEffect(() => {
    if (!ondokuId) {
      setOndoku(INITIAL_ONDOKU);
      isFetchingRef.current = false;
    } else {
      const ondokuIds = ondokus.map((ondoku) => ondoku.id);
      if (ondokuIds.includes(ondokuId)) {
        const ondoku = ondokus.filter((ondoku) => ondoku.id === ondokuId)[0];
        setOndoku(ondoku);
        isFetchingRef.current = false;
      } else {
        const fetchData = async () => {
          console.log('get ondoku');
          getDoc(doc(db, COLLECTION, ondokuId))
            .then((doc) => {
              if (doc.exists()) {
                const ondoku: Ondoku = {
                  id: doc.id,
                  title: doc.data().title,
                  createdAt: doc.data().createdAt,
                  downloadURL: doc.data().downloadURL,
                  isShowAccents: doc.data().isShowAccents,
                };
                setOndoku(ondoku);
              } else {
                setOndoku(INITIAL_ONDOKU);
              }
              isFetchingRef.current = false;
            })
            .catch((e) => {
              console.warn(e);
              setOndoku(INITIAL_ONDOKU);
              isFetchingRef.current = false;
            });
        };
        fetchData();
      }
    }
  }, [ondokuId]);

  useEffect(() => {
    if (!opened) return;
    const q = query(colRef, orderBy('createdAt', 'desc'), limit(LIMIT));
    const unsub = onSnapshot(
      q,
      (snapshot) => {
        const ondokus: Ondoku[] = [];
        console.log('snapshot ondokus');
        snapshot.forEach((doc) => {
          const ondoku: Ondoku = {
            id: doc.id,
            title: doc.data().title,
            createdAt: doc.data().createdAt,
            downloadURL: doc.data().downloadURL,
            isShowAccents: doc.data().isShowAccents,
          };
          ondokus.push(ondoku);
        });
        setOndokus(ondokus);
      },
      (error) => {
        setOndokus([]);
        console.log(error);
      }
    );

    return () => {
      unsub();
    };
  }, [opened]);

  return {
    ondoku,
    ondokus,
  };
};

export const useHandleOndokus = () => {
  const updateOndoku = async (
    ondoku: Ondoku
  ): Promise<{ success: boolean }> => {
    const { id, ...omitted } = ondoku;
    console.log('update Ondoku');
    return await updateDoc(doc(db, COLLECTION, ondoku.id), { ...omitted })
      .then(() => {
        return { success: true };
      })
      .catch((e) => {
        console.warn(e);
        return { success: false };
      });
  };
  const toggleShowAccents = async (ondoku: Ondoku) => {
    const newOndoku: Ondoku = {
      ...ondoku,
      isShowAccents: !ondoku.isShowAccents,
    };
    const { id, ...omitted } = newOndoku;
    console.log('update Ondoku');
    updateDoc(doc(db, COLLECTION, ondoku.id), { ...omitted });
  };
  const deleteOndoku = (id: string) => {
    console.log('delete Ondoku');
    deleteDoc(doc(db, COLLECTION, id));
  };
  return {
    deleteOndoku,
    updateOndoku,
    toggleShowAccents,
  };
};
