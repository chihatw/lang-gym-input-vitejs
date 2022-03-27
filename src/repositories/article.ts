import { db } from './firebase';
import { Article, buildArticle, CreateArticle } from '../entities/Article';

const articlesRef = db.collection('articles');

export const getArticle = async (id: string) => {
  try {
    console.log('get article');
    const snapshot = await articlesRef.doc(id).get();

    return buildArticle(id, snapshot.data()!);
  } catch (e) {
    console.warn(e);
    return null;
  }
};

export const getArticles = async (
  uid: string,
  limit: number,
  startAfter?: number
) => {
  try {
    const query = articlesRef
      .where('uid', '==', uid)
      .orderBy('createdAt', 'desc')
      .limit(limit);
    console.log('get articles');
    const snapshot = !startAfter
      ? await query.get()
      : await query.startAfter(startAfter).get();
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
    const docRef = await articlesRef.add(article);
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
    await articlesRef.doc(id).update(omittedArticle);
    return { success: true };
  } catch (e) {
    console.warn(e);
    return { success: false };
  }
};

export const deleteArticle = async (id: string) => {
  try {
    console.log('delete article');
    await articlesRef.doc(id).delete();
    return { success: true };
  } catch (e) {
    console.warn(e);
  }
};
