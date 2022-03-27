import { buildUser } from '../entities/User';
import { db } from './firebase';

const usersRef = db.collection('users');

export const getUser = async (id: string) => {
  try {
    console.log('get user');
    const doc = await usersRef.doc(id).get();
    return buildUser(doc.id, doc.data()!);
  } catch (e) {
    console.warn(e);
    return null;
  }
};

export const getUsers = async (limit: number) => {
  try {
    console.log('get users');
    const snapshot = await usersRef.limit(limit).get();
    const users = snapshot.docs.map((doc) => buildUser(doc.id, doc.data()));
    return users;
  } catch (e) {
    console.warn(e);
    return null;
  }
};
