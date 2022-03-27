import firebase from 'firebase/app';
import { buildSentence, CreateSentence, Sentence } from '../entities/Sentence';
import { db } from './firebase';

const sentencesRef = db.collection('sentences');

export const getSentence = async (id: string) => {
  try {
    console.log('get sentence');
    const doc = await sentencesRef.doc(id).get();
    return buildSentence(doc.id, doc.data()!);
  } catch (e) {
    console.warn(e);
    return null;
  }
};

export const getSentences = async (articleID: string) => {
  try {
    console.log('get sentences');
    const snapshot = await sentencesRef
      .where('article', '==', articleID)
      .orderBy('line')
      .get();
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
  limit: number
) => {
  try {
    let query: firebase.firestore.Query = db.collection('sentences');
    if (!tags.length) return [];
    tags.forEach((tag) => {
      query = sentencesRef.where(`tags.${tag}`, '==', true);
    });
    console.log('get sentnces by tags');
    const snapshot = await query.where('uid', '==', uid).limit(limit).get();
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
  const batch = db.batch();
  try {
    sentences.forEach((s) => {
      batch.set(sentencesRef.doc(), s, { merge: false });
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
    await sentencesRef.doc(id).update(omittedSentence);
    return { success: true };
  } catch (e) {
    console.warn(e);
    return { success: false };
  }
};

export const updateSentences = async (sentences: Sentence[]) => {
  const batch = db.batch();
  try {
    sentences.forEach((s) => {
      const { id, ...omittedSentence } = s;
      batch.update(sentencesRef.doc(id), omittedSentence);
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
  const batch = db.batch();
  try {
    console.log('get sentences');
    const snapshot = await sentencesRef
      .where('article', '==', articleID)
      .orderBy('line')
      .get();
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
