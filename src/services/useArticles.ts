import {
  limit,
  orderBy,
  Unsubscribe,
  DocumentData,
  QueryConstraint,
} from '@firebase/firestore';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { db } from '../repositories/firebase';
import {
  addDocument,
  updateDocument,
  deleteDocument,
  snapshotCollection,
} from '../repositories/utils';

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

const COLLECTION = 'articles';

export const useArticles = ({
  opened,
  articleId,
}: {
  opened: boolean;
  articleId: string;
}) => {
  const [article, setArticle] = useState(INITIAL_ARTICLE);
  const [articles, setArticles] = useState<Article[]>([]);

  const _snapshotCollection = useMemo(
    () =>
      function <T>({
        queries,
        setValues,
        buildValue,
      }: {
        queries?: QueryConstraint[];
        setValues: (value: T[]) => void;
        buildValue: (value: DocumentData) => T;
      }): Unsubscribe {
        return snapshotCollection({
          db,
          colId: COLLECTION,
          queries,
          setValues,
          buildValue,
        });
      },
    []
  );

  useEffect(() => {
    const article = articles.filter((article) => article.id === articleId)[0];
    setArticle(article ?? INITIAL_ARTICLE);
  }, [articleId, articles]);

  useEffect(() => {
    if (!opened) return;
    const unsub = _snapshotCollection({
      queries: [orderBy('createdAt', 'desc'), limit(6)],
      setValues: setArticles,
      buildValue: buildArticle,
    });
    return () => {
      unsub();
    };
  }, [opened]);
  return { article, articles };
};

export const useHandleArticles = () => {
  const _addDocument = useMemo(
    () =>
      async function <T extends { id: string }>(
        value: Omit<T, 'id'>
      ): Promise<T | null> {
        return await addDocument({
          db,
          colId: COLLECTION,
          value,
        });
      },
    []
  );
  const _updateDocument = useMemo(
    () =>
      async function <T extends { id: string }>(value: T): Promise<T | null> {
        return await updateDocument({
          db,
          colId: COLLECTION,
          value,
        });
      },
    []
  );

  const _deleteDocument = useCallback(async (id: string) => {
    return await deleteDocument({ db, colId: COLLECTION, id });
  }, []);

  const addArticle = async (
    article: Omit<Article, 'id'>
  ): Promise<Article | null> => {
    return await _addDocument(article);
  };

  const updateArticle = async (article: Article): Promise<Article | null> => {
    return await _updateDocument(article);
  };
  const deleteArticle = (id: string) => {
    _deleteDocument(id);
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
