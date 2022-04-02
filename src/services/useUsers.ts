import {
  collection,
  doc,
  getDoc,
  getDocs,
  limit,
  query,
  onSnapshot,
} from '@firebase/firestore';
import { useEffect, useState } from 'react';
import { db } from '../repositories/firebase';

export type User = {
  id: string;
  createdAt: number;
  displayname: string;
};

const COLLECTION = 'users';

const colRef = collection(db, COLLECTION);

const LIMIT = 10;

export const useUsers = ({ opened }: { opened: boolean }) => {
  const [users, setUsers] = useState<User[]>([]);
  useEffect(() => {
    if (!opened) return;
    const q = query(colRef, limit(LIMIT));
    const unsub = onSnapshot(
      q,
      (snapshot) => {
        console.log('snapshot users');
        const users: User[] = [];
        snapshot.forEach((doc) => {
          const user: User = {
            id: doc.id,
            createdAt: doc.data().createdAt,
            displayname: doc.data().displayname,
          };
          users.push(user);
        });
        setUsers(users);
      },
      (e) => {
        console.warn(e);
        setUsers([]);
      }
    );
    return () => {
      unsub();
    };
  }, [opened]);
  return { users };
};
