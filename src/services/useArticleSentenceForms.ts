import { DocumentData } from '@firebase/firestore';
import { useMemo } from 'react';
import { ArticleSentenceForm } from '../Model';
import { db } from '../repositories/firebase';
import { addDocument, updateDocument } from '../repositories/utils';

const COLLECTION = 'articleSentenceForms';

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
