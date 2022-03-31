import {
  query,
  getDocs,
  orderBy,
  limit,
  collection,
  doc,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
} from '@firebase/firestore';
import { buildOndoku, CreateOndoku, Ondoku } from '../entities/Ondoku';
import { db } from './firebase';

const COLLECTION = 'ondokus';
const ondokusRef = collection(db, COLLECTION);

export const getOndoku = async (id: string) => {
  try {
    console.log('get ondoku');
    const snapshot = await getDoc(doc(db, COLLECTION, id));
    return buildOndoku(id, snapshot.data()!);
  } catch (e) {
    console.warn(e);
    return null;
  }
};

export const getOndokus = async (_limit: number) => {
  try {
    console.log('get ondokus');
    const q = query(ondokusRef, orderBy('createdAt', 'desc'), limit(_limit));
    const snapshot = await getDocs(q);

    return snapshot.docs.map((doc) => buildOndoku(doc.id, doc.data()));
  } catch (e) {
    console.warn(e);
    return null;
  }
};

export const createOndoku = async (ondoku: CreateOndoku) => {
  try {
    console.log('create ondoku');
    const docRef = await addDoc(ondokusRef, ondoku);
    return { success: true, ondokuID: docRef.id };
  } catch (e) {
    console.warn(e);
    return { success: false };
  }
};

export const updateOndoku = async (ondoku: Ondoku) => {
  try {
    const { id, ...omittedOndoku } = ondoku;
    console.log('update ondoku');
    await updateDoc(doc(db, COLLECTION, id), { ...omittedOndoku });
    return { success: true };
  } catch (e) {
    console.warn(e);
    return { success: false };
  }
};

export const deleteOndoku = async (id: string) => {
  try {
    console.log('delete ondoku');
    await deleteDoc(doc(db, COLLECTION, id));
    return { success: true };
  } catch (e) {
    console.warn(e);
    return { success: false };
  }
};
