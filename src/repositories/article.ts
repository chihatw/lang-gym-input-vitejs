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
import { buildArticle, CreateArticle } from '../entities/Article';
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

export const getArticles = async (
  uid: string,
  _limit: number,
  _startAfter?: number
) => {
  try {
    let q = query(
      articlesRef,
      where('uid', '==', uid),
      orderBy('createdAt', 'desc'),
      limit(_limit)
    );

    console.log('get articles');

    if (!!startAfter) {
      q = query(q, startAfter(_startAfter));
    }

    const snapshot = await getDocs(q);

    const articles = snapshot.docs.map((doc) =>
      buildArticle(doc.id, doc.data())
    );
    return articles;
  } catch (e) {
    console.warn(e);
    return null;
  }
};

export const createArticle = async (article: CreateArticle) => {
  try {
    console.log('create article');
    const docRef = await addDoc(articlesRef, article);
    return { success: true, articleID: docRef.id };
  } catch (e) {
    console.warn(e);
    return { success: false };
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
