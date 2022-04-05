import {
  doc,
  limit,
  query,
  addDoc,
  orderBy,
  updateDoc,
  deleteDoc,
  onSnapshot,
  collection,
  Unsubscribe,
  DocumentData,
} from '@firebase/firestore';
import { useCallback, useEffect, useState } from 'react';
import { db } from '../repositories/firebase';

export type Article = {
  id: string;
  uid: string;
  marks: string[];
  title: string;
  embedID: string;
  createdAt: number;
  downloadURL: string;
  isShowParse: boolean;
  hasRecButton: boolean;
  isShowAccents: boolean;
  userDisplayname: string;
};

export const INITIAL_ARTICLE: Article = {
  id: '',
  uid: '',
  marks: [],
  title: '',
  embedID: '',
  createdAt: 0,
  downloadURL: '',
  isShowParse: false,
  hasRecButton: false,
  isShowAccents: false,
  userDisplayname: '',
};

const LIMIT = 6;
const COLLECTION = 'articles';
const colRef = collection(db, COLLECTION);

/**
 * アプリ全体で使用
 */
export const useArticles = ({
  opened,
  articleId,
  setIsFetching,
}: {
  opened: boolean;
  articleId: string;
  setIsFetching: (value: boolean) => void;
}) => {
  const [article, setArticle] = useState(INITIAL_ARTICLE);
  const [articles, setArticles] = useState<Article[]>([]);

  const finishFetchData = useCallback((article: Article) => {
    setArticle(article);
    setIsFetching(false);
  }, []);

  useEffect(() => {
    let unsub: Unsubscribe | null = null;
    // articleId が未設定の場合
    if (!articleId) {
      finishFetchData(INITIAL_ARTICLE);
    } else {
      const article = articles.filter((article) => articleId === article.id)[0];
      if (!!article) {
        finishFetchData(article);
      } else {
        unsub = onSnapshot(
          doc(db, COLLECTION, articleId),
          (doc) => {
            console.log(`snap shot article: [${articleId}]`);
            if (doc.exists()) {
              const article = buildArticle(doc);
              finishFetchData(article);
            } else {
              finishFetchData(INITIAL_ARTICLE);
            }
          },
          (e) => {
            console.warn(e);
            finishFetchData(INITIAL_ARTICLE);
          }
        );
      }
    }
    return () => {
      !!unsub && unsub();
    };
  }, [articleId, articles]);

  useEffect(() => {
    if (!opened) return;
    const q = query(colRef, orderBy('createdAt', 'desc'), limit(LIMIT));
    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        console.log('snapshot articles');
        const articles = snapshot.docs.map((doc) => buildArticle(doc));
        setArticles(articles);
      },
      (e) => {
        console.warn(e);
        setArticles([]);
      }
    );
    return () => {
      unsubscribe();
    };
  }, [opened]);
  return { article, articles };
};

/**
 * 単発のデータ操作用
 */
export const useHandleArticles = () => {
  const addArticle = async (
    article: Omit<Article, 'id'>
  ): Promise<{
    success: boolean;
    articleId?: string;
  }> => {
    return await addDoc(colRef, article)
      .then((doc) => {
        return { success: true, articleId: doc.id };
      })
      .catch((e) => {
        console.warn(e);
        return { success: false };
      });
  };

  const updateArticle = async (
    article: Article
  ): Promise<{ success: boolean }> => {
    const { id, ...omitted } = article;
    console.log('update article');
    return await updateDoc(doc(db, COLLECTION, id), { ...omitted })
      .then(() => {
        return { success: true };
      })
      .catch((e) => {
        console.warn(e);
        return { success: false };
      });
  };
  const deleteArticle = (id: string) => {
    console.log('delete article');
    deleteDoc(doc(db, COLLECTION, id));
  };

  return { updateArticle, deleteArticle, addArticle };
};

const buildArticle = (doc: DocumentData) => {
  const {
    uid,
    marks,
    title,
    embedID,
    createdAt,
    isShowParse,
    downloadURL,
    hasRecButton,
    isShowAccents,
    userDisplayname,
  } = doc.data();
  const article: Article = {
    id: doc.id,
    uid: uid || '',
    marks: marks || [],
    title: title || '',
    embedID: embedID || '',
    createdAt: createdAt || 0,
    isShowParse: isShowParse || false,
    downloadURL: downloadURL || '',
    hasRecButton: hasRecButton || false,
    isShowAccents: isShowAccents || false,
    userDisplayname: userDisplayname || '',
  };
  return article;
};
