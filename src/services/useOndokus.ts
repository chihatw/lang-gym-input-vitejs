import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  doc,
  limit,
  orderBy,
  updateDoc,
  collection,
  QueryConstraint,
  Unsubscribe,
  DocumentData,
} from '@firebase/firestore';

import { db } from '../repositories/firebase';
import {
  addDocument,
  deleteDocument,
  snapshotCollection,
  updateDocument,
} from '../repositories/utils';

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

const buildOndoku = (doc: DocumentData) => {
  const ondoku: Ondoku = {
    id: doc.id,
    title: doc.data().title,
    createdAt: doc.data().createdAt,
    downloadURL: doc.data().downloadURL,
    isShowAccents: doc.data().isShowAccents,
  };
  return ondoku;
};

export const useOndokus = ({
  opened,
  ondokuId,
}: {
  opened: boolean;
  ondokuId: string;
}) => {
  const [ondoku, setOndoku] = useState(INITIAL_ONDOKU);
  const [ondokus, setOndokus] = useState<Ondoku[]>([]);

  const _snapshotCollection = useMemo(
    () =>
      function <T>({
        queries,
        setValues,
        buildValue,
      }: {
        queries?: QueryConstraint[];
        setValues: (value: T[]) => void;
        buildValue: (value: DocumentData) => T;
      }): Unsubscribe {
        return snapshotCollection({
          db,
          colId: COLLECTION,
          queries,
          setValues,
          buildValue,
        });
      },
    []
  );

  useEffect(() => {
    const ondoku = ondokus.filter((ondoku) => ondoku.id === ondokuId)[0];
    setOndoku(ondoku ?? INITIAL_ONDOKU);
  }, [ondokuId]);

  useEffect(() => {
    if (!opened) return;
    const unsub = _snapshotCollection({
      queries: [orderBy('createdAt', 'desc'), limit(LIMIT)],
      setValues: setOndokus,
      buildValue: buildOndoku,
    });
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
  const _addDocument = useMemo(
    () =>
      async function <T extends { id: string }>(
        value: Omit<T, 'id'>
      ): Promise<T | null> {
        return await addDocument({
          db,
          colId: COLLECTION,
          value,
        });
      },
    []
  );
  const _updateDocument = useMemo(
    () =>
      async function <T extends { id: string }>(value: T): Promise<T | null> {
        return await updateDocument({
          db,
          colId: COLLECTION,
          value,
        });
      },
    []
  );

  const _deleteDocument = useCallback(async (id: string) => {
    return await deleteDocument({ db, colId: COLLECTION, id });
  }, []);
  const addOndoku = async (
    ondoku: Omit<Ondoku, 'id'>
  ): Promise<Ondoku | null> => {
    return await _addDocument(ondoku);
  };
  const updateOndoku = async (ondoku: Ondoku): Promise<Ondoku | null> => {
    return await _updateDocument(ondoku);
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
  const deleteOndoku = async (id: string): Promise<boolean> => {
    return await _deleteDocument(id);
  };
  return {
    addOndoku,
    deleteOndoku,
    updateOndoku,
    toggleShowAccents,
  };
};
