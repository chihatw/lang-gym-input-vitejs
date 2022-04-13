import {
  where,
  collection,
  DocumentData,
  Unsubscribe,
  QueryConstraint,
} from '@firebase/firestore';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { Article } from './useArticles';
import { db } from '../repositories/firebase';
import {
  addDocument,
  deleteDocument,
  snapshotDocumentByQuery,
} from '../repositories/utils';

export type Assignment = {
  id: string;
  uid: string;
  ondoku: string;
  article: string;
  downloadURL: string;
};

export const INITIAL_ASSIGNMENT: Assignment = {
  id: '',
  uid: '',
  ondoku: '',
  article: '',
  downloadURL: '',
};

const COLLECTION = 'assignments';

const colRef = collection(db, COLLECTION);

export const useAssignments = ({ article }: { article: Article }) => {
  const [assignment, setAssignment] = useState(INITIAL_ASSIGNMENT);

  const _snapshotDocumentByQuery = useMemo(
    () =>
      function <T>({
        queries,
        initialValue,
        setValue,
        buildValue,
      }: {
        queries?: QueryConstraint[];
        initialValue: T;
        setValue: (value: T) => void;
        buildValue: (value: DocumentData) => T;
      }): Unsubscribe {
        return snapshotDocumentByQuery({
          db,
          colId: COLLECTION,
          queries,
          initialValue,
          setValue,
          buildValue,
        });
      },
    []
  );

  useEffect(() => {
    if (!article.id) return;
    const unsub = _snapshotDocumentByQuery({
      queries: [where('article', '==', article.id)],
      initialValue: INITIAL_ASSIGNMENT,
      setValue: setAssignment,
      buildValue: buildAssignment,
    });
    return () => {
      unsub();
    };
  }, [article]);
  return { assignment };
};
export const useHandleAssignments = () => {
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
  const _deleteDocument = useCallback(async (id: string) => {
    return await deleteDocument({ db, colId: COLLECTION, id });
  }, []);

  const createAssignment = async (
    assignment: Omit<Assignment, 'id'>
  ): Promise<Assignment | null> => {
    return await _addDocument(assignment);
  };

  const deleteAssignment = async (assignmentId: string): Promise<boolean> => {
    return await _deleteDocument(assignmentId);
  };

  return { createAssignment, deleteAssignment };
};

const buildAssignment = (doc: DocumentData) => {
  const assignment: Assignment = {
    id: doc.id,
    uid: doc.data().uid,
    ondoku: doc.data().ondoku,
    article: doc.data().article,
    downloadURL: doc.data().downloadURL,
  };
  return assignment;
};
