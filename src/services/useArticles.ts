import { DocumentData } from '@firebase/firestore';
import { useCallback, useMemo } from 'react';
import { Article } from '../Model';
import { db } from '../repositories/firebase';
import {
  addDocument,
  updateDocument,
  deleteDocument,
} from '../repositories/utils';

const COLLECTION = 'articles';

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
