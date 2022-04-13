import {
  where,
  orderBy,
  Unsubscribe,
  DocumentData,
  QueryConstraint,
} from '@firebase/firestore';
import { useCallback, useEffect, useMemo, useState } from 'react';

import { db } from '../repositories/firebase';
import {
  updateDocument,
  snapshotCollection,
  batchUpdateDocuments,
  batchAddDocuments,
  batchDeleteDocuments,
} from '../repositories/utils';

type Accent = {
  moras: string[];
  pitchPoint: number;
};

export type AssignmentSentence = {
  id: string;
  end: number;
  uid: string;
  line: number;
  start: number;
  ondoku: string;
  accents: Accent[];
  article: string;
  mistakes: string[];
};

export const INITIAL_ASSINGMENT_SENTENCE: AssignmentSentence = {
  id: '',
  end: 0,
  uid: '',
  line: 0,
  start: 0,
  ondoku: '',
  accents: [],
  article: '',
  mistakes: [],
};

const COLLECTION = 'aSentences';

export const useAssignmentSentences = (articleId: string) => {
  const [assignmentSentences, setAssignmentSentences] = useState<
    AssignmentSentence[]
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
    if (!articleId) return;

    const unsub = _snapshotCollection({
      queries: [where('article', '==', articleId), orderBy('line')],
      setValues: setAssignmentSentences,
      buildValue: buildAssignmentSentence,
    });

    return () => {
      unsub();
    };
  }, [articleId]);
  return { assignmentSentences };
};
export const useHandleAssignmentSentences = () => {
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

  const _batchUpdateDocuments = useMemo(
    () =>
      async function <T extends { id: string }>(values: T[]): Promise<boolean> {
        return await batchUpdateDocuments({ db, colId: COLLECTION, values });
      },
    []
  );

  const _batchAddDocuments = useMemo(
    () =>
      async function <T extends { id: string }>(
        values: Omit<T, 'id'>[]
      ): Promise<boolean> {
        return await batchAddDocuments({ db, colId: COLLECTION, values });
      },
    []
  );

  const _batchDeleteDocuments = useCallback(async (ids: string[]) => {
    return await batchDeleteDocuments({ db, colId: COLLECTION, ids });
  }, []);

  const updateAssignmentSentence = async (
    assignmentSentence: AssignmentSentence
  ): Promise<AssignmentSentence | null> => {
    return await _updateDocument(assignmentSentence);
  };

  const createAssignmentSentences = async (
    assignmentSentences: Omit<AssignmentSentence, 'id'>[]
  ): Promise<boolean> => {
    return await _batchAddDocuments(assignmentSentences);
  };

  const updateAssignmentSentences = async (
    assignmentSentences: AssignmentSentence[]
  ): Promise<boolean> => {
    return await _batchUpdateDocuments(assignmentSentences);
  };

  const deleteAssignmentSentences = async (ids: string[]): Promise<boolean> => {
    return await _batchDeleteDocuments(ids);
  };
  return {
    updateAssignmentSentence,
    createAssignmentSentences,
    updateAssignmentSentences,
    deleteAssignmentSentences,
  };
};

const buildAssignmentSentence = (doc: DocumentData) => {
  const assignmentSentence: AssignmentSentence = {
    id: doc.id,
    end: doc.data().end,
    uid: doc.data().uid,
    line: doc.data().line,
    start: doc.data().start,
    ondoku: doc.data().ondoku,
    accents: doc.data().accents,
    article: doc.data().article,
    mistakes: doc.data().mistakes,
  };
  return assignmentSentence;
};
