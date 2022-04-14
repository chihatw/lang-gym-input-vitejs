import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  where,
  orderBy,
  DocumentData,
  QueryConstraint,
  Unsubscribe,
} from '@firebase/firestore';

import { db } from '../repositories/firebase';
import { Tags } from '../entities/Tags';
import { Accent } from '../entities/Accent';
import { Article } from './useArticles';
import {
  batchAddDocuments,
  batchDeleteDocuments,
  batchUpdateDocuments,
  getDocumentsByQuery,
  snapshotCollection,
  updateDocument,
} from '../repositories/utils';

const COLLECTION = 'sentences';

export type Sentence = {
  id: string;
  uid: string;
  end: number;
  tags: Tags;
  kana: string;
  line: number;
  start: number;
  title: string;
  accents: Accent[];
  article: string;
  chinese: string;
  japanese: string;
  original: string;
  createdAt: number;
};

export const INITIAL_SENTENCE: Sentence = {
  id: '',
  uid: '',
  end: 0,
  tags: {},
  kana: '',
  line: 0,
  start: 0,
  title: '',
  accents: [],
  article: '',
  chinese: '',
  japanese: '',
  original: '',
  createdAt: 0,
};

export const useSentences = (articleId: string) => {
  const [sentences, setSentences] = useState<Sentence[]>([]);

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
    if (!articleId) return;
    const unsub = _snapshotCollection({
      queries: [where('article', '==', articleId), orderBy('line')],
      buildValue: buildSentence,
      setValues: setSentences,
    });
    return () => {
      unsub();
    };
  }, [articleId]);
  return { sentences };
};

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
    sentence: Sentence
  ): Promise<Sentence | null> => {
    return await _updateDocument(sentence);
  };

  const createSentences = async (
    sentences: Omit<Sentence, 'id'>[]
  ): Promise<string[]> => {
    return await _batchAddDocuments(sentences);
  };

  const updateSentences = async (sentences: Sentence[]): Promise<boolean> => {
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

const buildSentence = (doc: DocumentData) => {
  const sentence: Sentence = {
    id: doc.id,
    uid: doc.data().uid,
    end: doc.data().end,
    tags: doc.data().tags,
    kana: doc.data().kana,
    line: doc.data().line,
    start: doc.data().start,
    title: doc.data().title,
    accents: doc.data().accents,
    article: doc.data().article,
    chinese: doc.data().chinese,
    japanese: doc.data().japanese,
    original: doc.data().original,
    createdAt: doc.data().createdAt,
  };
  return sentence;
};
