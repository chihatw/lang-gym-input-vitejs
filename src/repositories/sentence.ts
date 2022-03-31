import {
  collection,
  doc,
  getDoc,
  query,
  where,
  getDocs,
  orderBy,
  limit,
  writeBatch,
  updateDoc,
} from '@firebase/firestore';
import { buildSentence, CreateSentence, Sentence } from '../entities/Sentence';
import { db } from './firebase';

const COLLECTION = 'sentences';

const sentencesRef = collection(db, COLLECTION);

export const getSentence = async (id: string) => {
  try {
    console.log('get sentence');
    const snapshot = await getDoc(doc(db, COLLECTION, id));
    return buildSentence(snapshot.id, snapshot.data()!);
  } catch (e) {
    console.warn(e);
    return null;
  }
};

export const getSentences = async (articleID: string) => {
  try {
    console.log('get sentences');
    const q = query(
      sentencesRef,
      where('article', '==', articleID),
      orderBy('line')
    );
    const snapshot = await getDocs(q);
    const sentences = snapshot.docs.map((doc) =>
      buildSentence(doc.id, doc.data())
    );
    return sentences;
  } catch (e) {
    console.warn(e);
    return null;
  }
};

export const getSentencesByTags = async (
  tags: string[],
  uid: string,
  _limit: number
) => {
  try {
    let q = query(sentencesRef);
    // let query: firebase.firestore.Query = db.collection('sentences');
    if (!tags.length) return [];
    tags.forEach((tag) => {
      q = query(q, where(`tags.${tag}`, '==', true));
    });
    console.log('get sentnces by tags');
    q = query(q, where('uid', '==', uid), limit(_limit));
    const snapshot = await getDocs(q);
    const sentences = snapshot.docs.map((doc) =>
      buildSentence(doc.id, doc.data())
    );
    return sentences;
  } catch (e) {
    console.warn(e);
    return [];
  }
};

export const createSentences = async (sentences: CreateSentence[]) => {
  const batch = writeBatch(db);
  try {
    sentences.forEach((sentence) => {
      const docRef = doc(sentencesRef);
      batch.set(docRef, sentence);
    });
    console.log('create sentences');
    await batch.commit();
    return { success: true };
  } catch (e) {
    console.warn(e);
    return { success: false };
  }
};

export const updateSentence = async (sentence: Sentence) => {
  try {
    const { id, ...omittedSentence } = sentence;
    console.log('update sentence');
    await updateDoc(doc(db, COLLECTION, id), { ...omittedSentence });
    return { success: true };
  } catch (e) {
    console.warn(e);
    return { success: false };
  }
};

export const updateSentences = async (sentences: Sentence[]) => {
  const batch = writeBatch(db);
  try {
    sentences.forEach((s) => {
      const { id, ...omittedSentence } = s;
      batch.update(doc(db, COLLECTION, id), { ...omittedSentence });
    });
    console.log('update sentences');
    await batch.commit();
    return { success: true };
  } catch (e) {
    console.warn(e);
    return { success: false };
  }
};

export const deleteSentences = async (articleID: string) => {
  const batch = writeBatch(db);
  try {
    console.log('get sentences');
    const q = query(
      sentencesRef,
      where('article', '==', articleID),
      orderBy('line')
    );
    const snapshot = await getDocs(q);

    if (!snapshot.empty) {
      snapshot.docs.forEach((doc) => {
        batch.delete(doc.ref);
      });
      console.log('delete sentences');
      await batch.commit();
      return { success: true };
    }
  } catch (e) {
    console.warn(e);
    return { success: false };
  }
};
