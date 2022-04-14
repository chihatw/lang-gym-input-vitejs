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
import { AssignmentSentence } from './useAssignmentSentences';

const COLLECTION = 'aSentences';

export const useOndokuAssignmentSentences = (ondokuId: string) => {
  const [ondokuAssignmentSentences, setOndokuAssignmentSentences] = useState<
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
    if (!ondokuId) return;

    const unsub = _snapshotCollection({
      queries: [where('ondoku', '==', ondokuId), orderBy('line')],
      setValues: setOndokuAssignmentSentences,
      buildValue: buildAssignmentSentence,
    });

    return () => {
      unsub();
    };
  }, [ondokuId]);
  return { ondokuAssignmentSentences };
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
      ): Promise<string[]> {
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
    ondokuAssignmentSentences: Omit<AssignmentSentence, 'id'>[]
  ): Promise<string[]> => {
    return await _batchAddDocuments(ondokuAssignmentSentences);
  };

  const updateAssignmentSentences = async (
    ondokuAssignmentSentences: AssignmentSentence[]
  ): Promise<boolean> => {
    return await _batchUpdateDocuments(ondokuAssignmentSentences);
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
