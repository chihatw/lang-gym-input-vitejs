import {
  limit,
  Unsubscribe,
  DocumentData,
  QueryConstraint,
} from '@firebase/firestore';
import { useEffect, useMemo, useState } from 'react';
import { db } from '../repositories/firebase';
import { snapshotCollection } from '../repositories/utils';

export type User = {
  id: string;
  createdAt: number;
  displayname: string;
};

const COLLECTION = 'users';

const LIMIT = 10;

export const useUsers = ({ opened }: { opened: boolean }) => {
  const [users, setUsers] = useState<User[]>([]);

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
    if (!opened) return;
    const unsub = _snapshotCollection({
      queries: [limit(LIMIT)],
      buildValue: buildUser,
      setValues: setUsers,
    });
    return () => {
      unsub();
    };
  }, [opened]);
  return { users };
};

const buildUser = (doc: DocumentData) => {
  const user: User = {
    id: doc.id,
    createdAt: doc.data().createdAt,
    displayname: doc.data().displayname,
  };
  return user;
};
