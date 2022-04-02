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
  isShowAccents: false,
  userDisplayname: '',
};

const LIMIT = 6;
const COLLECTION = 'articles';
const colRef = collection(db, COLLECTION);

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
            console.log('snap shot article');
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
  }, [articleId]);

  useEffect(() => {
    if (!opened) return;
    const q = query(colRef, orderBy('createdAt', 'desc'), limit(LIMIT));
    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        console.log('snapshot article');
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

export const useHandleArticles = () => {
  const createArticle = async (
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

  return { updateArticle, deleteArticle, createArticle };
};

const buildArticle = (doc: DocumentData) => {
  const article: Article = {
    id: doc.id,
    uid: doc.data().uid,
    title: doc.data().title,
    embedID: doc.data().embedID,
    createdAt: doc.data().createdAt,
    isShowParse: doc.data().isShowParse,
    downloadURL: doc.data().downloadURL,
    isShowAccents: doc.data().isShowAccents,
    userDisplayname: doc.data().userDisplayname,
    marks: doc.data().marks,
  };
  return article;
};
