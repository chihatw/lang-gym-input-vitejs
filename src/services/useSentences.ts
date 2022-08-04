import { useCallback, useMemo } from 'react';
import { where, DocumentData, QueryConstraint } from '@firebase/firestore';

import { db } from '../repositories/firebase';

import {
  batchAddDocuments,
  batchDeleteDocuments,
  batchUpdateDocuments,
  getDocumentsByQuery,
  updateDocument,
} from '../repositories/utils';
import { ArticleSentence } from '../Model';

const COLLECTION = 'sentences';

export const useHandleSentences = () => {
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

  const _batchAddDocuments = useMemo(
    () =>
      async function <T extends { id: string }>(
        values: Omit<T, 'id'>[]
      ): Promise<string[]> {
        return await batchAddDocuments({ db, colId: COLLECTION, values });
      },
    []
  );

  const _batchUpdateDocuments = useMemo(
    () =>
      async function <T extends { id: string }>(values: T[]): Promise<boolean> {
        return await batchUpdateDocuments({ db, colId: COLLECTION, values });
      },
    []
  );

  const _batchDeleteDocuments = useCallback(async (ids: string[]) => {
    return await batchDeleteDocuments({ db, colId: COLLECTION, ids });
  }, []);

  const _getDocumentsByQuery = async <T>({
    queries,
    buildValue,
  }: {
    queries?: QueryConstraint[];
    buildValue: (value: DocumentData) => T;
  }): Promise<T[]> => {
    return await getDocumentsByQuery({
      db,
      colId: COLLECTION,
      queries,
      buildValue,
    });
  };

  const updateSentence = async (
    sentence: ArticleSentence
  ): Promise<ArticleSentence | null> => {
    return await _updateDocument(sentence);
  };

  const createSentences = async (
    sentences: Omit<ArticleSentence, 'id'>[]
  ): Promise<string[]> => {
    return await _batchAddDocuments(sentences);
  };

  const updateSentences = async (
    sentences: ArticleSentence[]
  ): Promise<boolean> => {
    return await _batchUpdateDocuments(sentences);
  };
  const deleteSentences = async (articleId: string): Promise<boolean> => {
    const sentenceIds = await _getDocumentsByQuery({
      queries: [where('article', '==', articleId)],
      buildValue: (doc: DocumentData) => doc.id as string,
    });
    return await _batchDeleteDocuments(sentenceIds);
  };
  return { updateSentence, createSentences, updateSentences, deleteSentences };
};
