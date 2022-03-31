import {
  collection,
  query,
  getDocs,
  where,
  orderBy,
  limit,
  startAfter,
  addDoc,
  deleteDoc,
  doc,
} from '@firebase/firestore';

import { buildUidOndoku, CreateUidOndoku } from '../entities/UidOndoku';
import { db } from './firebase';

const COLLECTION = 'uidOndokus';

const uidOndokusRef = collection(db, COLLECTION);

export const getUidOndokus = async (
  _limit: number,
  uid?: string,
  _startAfter?: number
) => {
  try {
    let q = query(uidOndokusRef);
    if (!!uid) {
      q = query(q, where('uid', '==', uid));
    }
    q = query(q, orderBy('createdAt', 'desc'), limit(_limit));

    if (!!startAfter) {
      q = query(q, startAfter(_startAfter));
    }
    console.log('get uid ondoku');
    const snapshot = await getDocs(q);
    const uidOndokus = snapshot.docs.map((doc) =>
      buildUidOndoku(doc.id, doc.data())
    );
    return uidOndokus;
  } catch (e) {
    console.warn(e);
    return null;
  }
};

export const createUidOndoku = async (uidOndoku: CreateUidOndoku) => {
  try {
    console.log('create uid ondoku');
    await addDoc(uidOndokusRef, uidOndoku);
    return { success: true };
  } catch (e) {
    console.warn(e);
    return { success: false };
  }
};

export const deleteUidOndoku = async (id: string) => {
  try {
    console.log('delete uid ondoku');
    await deleteDoc(doc(db, COLLECTION, id));
  } catch (e) {
    console.warn(e);
  }
};
