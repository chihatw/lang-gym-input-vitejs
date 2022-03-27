import {
  buildSentenceParseNew,
  CreateSentenceParseNew,
  SentenceParseNew,
} from '../entities/SentenceParseNew';
import { db } from './firebase';

const sentenceParseNewRef = db.collection('sentenceParseNews');

export const getSentenceParseNew = async (
  article: string,
  sentence: string
) => {
  try {
    console.log('get sentenceParseNew');
    const snapshot = await sentenceParseNewRef
      .where('article', '==', article)
      .where('sentence', '==', sentence)
      .get();
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
    const snapshot = await sentenceParseNewRef
      .where('article', '==', article)
      .get();
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
    await sentenceParseNewRef.add(sentenceParseNew);
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
    await sentenceParseNewRef.doc(id).update({
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
