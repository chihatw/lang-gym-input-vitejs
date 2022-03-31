import {
  doc,
  query,
  where,
  getDoc,
  getDocs,
  orderBy,
  updateDoc,
  collection,
  writeBatch,
} from '@firebase/firestore';
import {
  buildOndokuSentence,
  CreateOndokuSentence,
  OndokuSentence,
  UpdateOndokuSentence,
} from '../entities/OndokuSentence';
import { db } from './firebase';

const COLLECTION = 'oSentences';
const ondokuSentencesRef = collection(db, 'oSentences');

export const getOndokuSentence = async (id: string) => {
  try {
    console.log('get ondoku sentence');
    const snapshot = await getDoc(doc(db, COLLECTION, id));
    return snapshot.exists()
      ? buildOndokuSentence(snapshot.id, snapshot.data())
      : null;
  } catch (e) {
    console.warn(e);
    return null;
  }
};

export const getOndokuSentences = async (ondokuID: string) => {
  try {
    console.log('get ondoku sentences');
    const q = query(
      ondokuSentencesRef,
      where('ondoku', '==', ondokuID),
      orderBy('line')
    );

    const snapshot = await getDocs(q);
    const ondokuSentences = snapshot.docs.map((doc) =>
      buildOndokuSentence(doc.id, doc.data())
    );
    return ondokuSentences;
  } catch (e) {
    console.warn(e);
    return null;
  }
};

export const updateOndokuSentence = async (
  id: string,
  ondokuSentence: UpdateOndokuSentence
) => {
  try {
    console.log('update ondoku sentence');
    await updateDoc(doc(db, COLLECTION, id), { ...ondokuSentence });
    return { success: true };
  } catch (e) {
    console.warn(e);
    return { success: false };
  }
};

export const updateOndokuSentences = async (
  ondokuSentences: OndokuSentence[]
) => {
  const batch = writeBatch(db);
  try {
    ondokuSentences.forEach((s) => {
      const { id, ...omittedOndokuSentence } = s;
      batch.update(doc(db, COLLECTION, id), { ...omittedOndokuSentence });
    });
    console.log('update ondoku sentences');
    await batch.commit();
    return { success: true };
  } catch (e) {
    console.warn(e);
    return { success: false };
  }
};

export const createOndokuSentences = async (
  ondokuSentences: CreateOndokuSentence[]
) => {
  try {
    const batch = writeBatch(db);
    ondokuSentences.forEach((oSentence) => {
      const docRef = doc(ondokuSentencesRef);
      batch.set(docRef, oSentence);
    });
    console.log('create ondoku sentences');
    await batch.commit();
    return { success: true };
  } catch (e) {
    console.warn(e);
    return { success: false };
  }
};

export const deleteOndokuSentences = async (ondokuID: string) => {
  try {
    console.log('get ondoku sentences');

    const q = query(ondokuSentencesRef, where('ondoku', '==', ondokuID));

    const snapshot = await getDocs(q);
    const batch = writeBatch(db);
    snapshot.forEach((doc) => {
      batch.delete(doc.ref);
    });
    console.log('delete ondoku sentences');
    await batch.commit();
    return { success: true };
  } catch (e) {
    console.warn(e);
    return { success: false };
  }
};
