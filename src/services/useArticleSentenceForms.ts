import {
  where,
  orderBy,
  DocumentData,
  QueryConstraint,
  Unsubscribe,
} from '@firebase/firestore';
import { FSentences } from 'fsentence-types';
import { useEffect, useMemo, useState } from 'react';
import { db } from '../repositories/firebase';
import {
  addDocument,
  snapshotCollection,
  updateDocument,
} from '../repositories/utils';

export type ArticleSentenceForm = {
  id: string;
  lineIndex: number;
  articleId: string;
  sentences: FSentences;
};

export const INITIAL_ARTICLE_SENTENCE_FORM: ArticleSentenceForm = {
  id: '',
  lineIndex: 0,
  articleId: '',
  sentences: {},
};

const COLLECTION = 'articleSentenceForms';

export const useArticleSentenceForms = (articleId: string) => {
  const [articleSentenceForms, setArticleSentenceForms] = useState<
    ArticleSentenceForm[]
  >([]);
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
    if (!articleId) {
      setArticleSentenceForms([]);
      return;
    }
    const unsub = _snapshotCollection({
      buildValue: buildArticleSentenceForm,
      setValues: setArticleSentenceForms,
      queries: [where('articleId', '==', articleId), orderBy('lineIndex')],
    });
    return () => {
      unsub();
    };
  }, [articleId]);
  return { articleSentenceForms };
};
export const useHandleArticleSentenceForms = () => {
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

  const addArticleSentenceForm = async (
    articleSentenceForm: Omit<ArticleSentenceForm, 'id'>
  ) => {
    return await _addDocument(articleSentenceForm);
  };

  const updateArticleSentenceForm = async (
    articleSentenceForm: ArticleSentenceForm
  ) => {
    return await _updateDocument(articleSentenceForm);
  };

  return { addArticleSentenceForm, updateArticleSentenceForm };
};

const buildArticleSentenceForm = (doc: DocumentData) => {
  const { articleId, lineIndex, sentences } = doc.data();
  const articleSentenceForm: ArticleSentenceForm = {
    id: doc.id || '',
    articleId: articleId || '',
    lineIndex: lineIndex || 0,
    sentences: sentences || {},
  };
  return articleSentenceForm;
};
