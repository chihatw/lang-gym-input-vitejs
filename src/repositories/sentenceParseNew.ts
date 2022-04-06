import {
  collection,
  query,
  getDocs,
  where,
  addDoc,
  updateDoc,
  doc,
} from '@firebase/firestore';
import { buildSentenceParseNew } from '../entities/SentenceParseNew';
import {
  CreateSentenceParseNew,
  SentenceParseNew,
} from '../services/useSentenceParseNews';
import { db } from './firebase';

const COLLECTION = 'sentenceParseNews';

const sentenceParseNewRef = collection(db, 'sentenceParseNews');

export const getSentenceParseNew = async (
  article: string,
  sentence: string
) => {
  try {
    console.log('get sentenceParseNew');
    const q = query(
      sentenceParseNewRef,
      where('article', '==', article),
      where('sentence', '==', sentence)
    );
    const snapshot = await getDocs(q);
    const doc = snapshot.docs[0];
    return !!doc ? buildSentenceParseNew(doc.id, doc.data()) : null;
  } catch (e) {
    console.warn(e);
    return null;
  }
};

export const getSentenceParseNews = async (article: string) => {
  try {
    console.log('get sentenceParseNews');
    const q = query(sentenceParseNewRef, where('article', '==', article));
    const snapshot = await getDocs(q);
    const sentenceParseNews: { [id: string]: SentenceParseNew } = {};
    snapshot.forEach((doc) => {
      sentenceParseNews[doc.data().sentence] = buildSentenceParseNew(
        doc.id,
        doc.data()
      );
    });
    return sentenceParseNews;
  } catch (e) {
    console.warn(e);
    return null;
  }
};

export const createSentenceParseNew = async (
  sentenceParseNew: CreateSentenceParseNew
) => {
  try {
    console.log('create sentenceParseNew');
    await addDoc(sentenceParseNewRef, sentenceParseNew);
    return { success: true };
  } catch (e) {
    console.warn(e);
    return { success: false };
  }
};

export const updateSentenceParseNew = async (
  sentenceParseNew: SentenceParseNew
) => {
  try {
    const { id, ...omittedSentenceParseNew } = sentenceParseNew;
    await updateDoc(doc(db, COLLECTION, id), {
      ...omittedSentenceParseNew,
      units: JSON.stringify(omittedSentenceParseNew.units),
      words: JSON.stringify(omittedSentenceParseNew.words),
      branches: JSON.stringify(omittedSentenceParseNew.branches),
      sentences: JSON.stringify(omittedSentenceParseNew.sentences),
      sentenceArrays: JSON.stringify(omittedSentenceParseNew.sentenceArrays),
      branchInvisibilities: JSON.stringify(
        omittedSentenceParseNew.branchInvisibilities
      ),
      commentInvisibilities: JSON.stringify(
        omittedSentenceParseNew.commentInvisibilities
      ),
    });
    return { success: true };
  } catch (e) {
    console.warn(e);
    return { success: false };
  }
};
