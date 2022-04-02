import {
  collection,
  doc,
  getDoc,
  getDocs,
  limit,
  query,
} from '@firebase/firestore';
import { buildUser } from '../entities/User';
import { db } from './firebase';

const COLLECTION = 'users';

const usersRef = collection(db, COLLECTION);

export const getUser = async (id: string) => {
  try {
    console.log('get user');
    const snapshot = await getDoc(doc(db, COLLECTION, id));
    return buildUser(snapshot.id, snapshot.data()!);
  } catch (e) {
    console.warn(e);
    return null;
  }
};

export const getUsers = async (_limit: number) => {
  try {
    console.log('get users!!');
    const q = query(usersRef, limit(_limit));
    const snapshot = await getDocs(q);
    const users = snapshot.docs.map((doc) => buildUser(doc.id, doc.data()));
    return users;
  } catch (e) {
    console.warn(e);
    return null;
  }
};
