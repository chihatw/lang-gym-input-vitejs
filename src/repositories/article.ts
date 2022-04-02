import { getDoc, doc } from '@firebase/firestore';
import { db } from './firebase';
import { buildArticle } from '../entities/Article';

const COLLECTION = 'articles';

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
