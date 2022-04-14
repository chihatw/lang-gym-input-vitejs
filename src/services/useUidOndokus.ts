import {
  doc,
  DocumentData,
  DocumentReference,
  limit,
  orderBy,
  QueryConstraint,
  Unsubscribe,
} from 'firebase/firestore';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { db } from '../repositories/firebase';
import {
  addDocument,
  deleteDocument,
  snapshotCollection,
} from '../repositories/utils';

export type UidOndoku = {
  id: string;
  createdAt: number;
  ondoku: DocumentReference | null;
  uid: string;
};

const COLLECTION = 'uidOndokus';

export const INITIAL_UIDONDOKU: UidOndoku = {
  id: '',
  createdAt: 0,
  ondoku: null,
  uid: '',
};

export const useUidOndokus = () => {
  const [uidOndokus, setUidOndokus] = useState<UidOndoku[]>([]);

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
    const unsub = _snapshotCollection({
      queries: [orderBy('createdAt', 'desc'), limit(4)],
      buildValue: buildUidOndoku,
      setValues: setUidOndokus,
    });
    return () => {
      unsub();
    };
  }, []);
  return { uidOndokus };
};
export const useHandleUidOndokus = () => {
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
  const _deleteDocument = useCallback(async (id: string) => {
    return await deleteDocument({ db, colId: COLLECTION, id });
  }, []);

  const createUidOndoku = async (value: Omit<UidOndoku, 'id'>) => {
    return await _addDocument(value);
  };

  const deleteUidOndoku = async (id: string) => {
    return await _deleteDocument(id);
  };
  return { deleteUidOndoku, createUidOndoku };
};

const buildUidOndoku = (doc: DocumentData) => {
  const uidOndoku: UidOndoku = {
    id: doc.id,
    createdAt: doc.data().createdAt,
    ondoku: doc.data().ondoku,
    uid: doc.data().uid,
  };
  return uidOndoku;
};
