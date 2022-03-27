import {
  buildOndokuSentence,
  CreateOndokuSentence,
  OndokuSentence,
  UpdateOndokuSentence,
} from '../entities/OndokuSentence';
import { db } from './firebase';

const ondokuSentencesRef = db.collection('oSentences');

export const getOndokuSentence = async (id: string) => {
  try {
    console.log('get ondoku sentence');
    const doc = await ondokuSentencesRef.doc(id).get();
    return doc.exists ? buildOndokuSentence(doc.id, doc.data()!) : null;
  } catch (e) {
    console.warn(e);
    return null;
  }
};

export const getOndokuSentences = async (ondokuID: string) => {
  try {
    console.log('get ondoku sentences');
    const snapshot = await ondokuSentencesRef
      .where('ondoku', '==', ondokuID)
      .orderBy('line')
      .get();
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
    await ondokuSentencesRef.doc(id).update(ondokuSentence);
    return { success: true };
  } catch (e) {
    console.warn(e);
    return { success: false };
  }
};

export const updateOndokuSentences = async (
  ondokuSentences: OndokuSentence[]
) => {
  const batch = db.batch();
  try {
    ondokuSentences.forEach((s) => {
      const { id, ...omittedOndokuSentence } = s;
      batch.update(ondokuSentencesRef.doc(id), omittedOndokuSentence);
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
    const batch = db.batch();
    ondokuSentences.forEach((s) => {
      batch.set(ondokuSentencesRef.doc(), s, { merge: false });
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
    const snapshot = await ondokuSentencesRef
      .where('ondoku', '==', ondokuID)
      .get();
    const batch = db.batch();
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
