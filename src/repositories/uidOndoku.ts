import { buildUidOndoku, CreateUidOndoku } from '../entities/UidOndoku';
import { db } from './firebase';

const uidOndokusRef = db.collection('uidOndokus');

export const getUidOndokus = async (
  limit: number,
  uid?: string,
  startAfter?: number
) => {
  try {
    let query = !!uid ? uidOndokusRef.where('uid', '==', uid) : uidOndokusRef;
    query = query.orderBy('createdAt', 'desc').limit(limit);
    console.log('get uid ondoku');
    const snapshot = !startAfter
      ? await query.get()
      : await query.startAfter(startAfter).get();
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
    await uidOndokusRef.add(uidOndoku);
    return { success: true };
  } catch (e) {
    console.warn(e);
    return { success: false };
  }
};

export const deleteUidOndoku = async (id: string) => {
  try {
    console.log('delete uid ondoku');
    await uidOndokusRef.doc(id).delete();
  } catch (e) {
    console.warn(e);
  }
};
