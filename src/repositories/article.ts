import {
  collection,
  startAfter,
  getDoc,
  getDocs,
  doc,
  query,
  where,
  limit,
  orderBy,
  addDoc,
  updateDoc,
  deleteDoc,
} from '@firebase/firestore';
import { db } from './firebase';
import { buildArticle } from '../entities/Article';
import { Article } from '../services/useArticles';

const COLLECTION = 'articles';

const articlesRef = collection(db, COLLECTION);

export const getArticle = async (id: string) => {
  try {
    console.log('get article');
    const snapshot = await getDoc(doc(db, COLLECTION, id));

    return buildArticle(id, snapshot.data()!);
  } catch (e) {
    console.warn(e);
    return null;
  }
};

export const updateArticle = async (article: Article) => {
  try {
    const { id, ...omittedArticle } = article;
    console.log('update article');
    await updateDoc(doc(db, COLLECTION, id), { ...omittedArticle });
    return { success: true };
  } catch (e) {
    console.warn(e);
    return { success: false };
  }
};

export const deleteArticle = async (id: string) => {
  try {
    console.log('delete article');
    await deleteDoc(doc(db, COLLECTION, id));
    return { success: true };
  } catch (e) {
    console.warn(e);
  }
};
