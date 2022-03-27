import { buildOndoku, CreateOndoku, Ondoku } from '../entities/Ondoku';
import { db } from './firebase';

const ondokusRef = db.collection('ondokus');

export const getOndoku = async (id: string) => {
  try {
    console.log('get ondoku');
    const snapshot = await ondokusRef.doc(id).get();
    return buildOndoku(id, snapshot.data()!);
  } catch (e) {
    console.warn(e);
    return null;
  }
};

export const getOndokus = async (limit: number) => {
  try {
    console.log('get ondokus');
    const snapshot = await ondokusRef
      .orderBy('createdAt', 'desc')
      .limit(limit)
      .get();
    return snapshot.docs.map((doc) => buildOndoku(doc.id, doc.data()));
  } catch (e) {
    console.warn(e);
    return null;
  }
};

export const createOndoku = async (ondoku: CreateOndoku) => {
  try {
    console.log('create ondoku');
    const docRef = await ondokusRef.add(ondoku);
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
    await ondokusRef.doc(id).update(omittedOndoku);
    return { success: true };
  } catch (e) {
    console.warn(e);
    return { success: false };
  }
};

export const deleteOndoku = async (id: string) => {
  try {
    console.log('delete ondoku');
    await ondokusRef.doc(id).delete();
    return { success: true };
  } catch (e) {
    console.warn(e);
    return { success: false };
  }
};
