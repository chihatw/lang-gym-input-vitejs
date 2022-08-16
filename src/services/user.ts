import {
  collection,
  DocumentData,
  getDocs,
  limit,
  query,
} from 'firebase/firestore';
import { User } from '../Model';
import { db } from '../repositories/firebase';

const COLLECTIONS = { users: 'users' };

export const getUsers = async () => {
  const users: User[] = [];
  const q = query(collection(db, COLLECTIONS.users), limit(10));
  console.log('get users');
  const querySnapshot = await getDocs(q);
  querySnapshot.forEach((doc) => {
    users.push(buildUser(doc));
  });
  return users;
};

const buildUser = (doc: DocumentData) => {
  const { createdAt, displayname } = doc.data();
  const user: User = {
    id: doc.id,
    createdAt: createdAt || 0,
    displayname: displayname || '',
  };
  return user;
};
