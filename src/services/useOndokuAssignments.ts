import {
  where,
  Unsubscribe,
  DocumentData,
  QueryConstraint,
} from '@firebase/firestore';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { db } from '../repositories/firebase';
import {
  addDocument,
  deleteDocument,
  snapshotDocumentByQuery,
} from '../repositories/utils';
import { Assignment, INITIAL_ASSIGNMENT } from './useAssignments';

const COLLECTION = 'assignments';

export const useOndokuAssignments = (ondokuId: string) => {
  const [ondokuAssignment, setOndokuAssignment] = useState(INITIAL_ASSIGNMENT);

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
    if (!ondokuId) return;
    const unsub = _snapshotDocumentByQuery({
      queries: [where('ondoku', '==', ondokuId)],
      initialValue: INITIAL_ASSIGNMENT,
      setValue: setOndokuAssignment,
      buildValue: buildAssignment,
    });
    return () => {
      unsub();
    };
  }, [ondokuId]);
  return { ondokuAssignment };
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

  const createOndokuAssignment = async (
    ondokuAssignment: Omit<Assignment, 'id'>
  ): Promise<Assignment | null> => {
    return await _addDocument(ondokuAssignment);
  };

  const deleteOndokuAssignment = async (
    assignmentId: string
  ): Promise<boolean> => {
    return await _deleteDocument(assignmentId);
  };

  return { createOndokuAssignment, deleteOndokuAssignment };
};

const buildAssignment = (doc: DocumentData) => {
  const ondokuAssignment: Assignment = {
    id: doc.id,
    uid: doc.data().uid,
    ondoku: doc.data().ondoku,
    article: doc.data().article,
    downloadURL: doc.data().downloadURL,
  };
  return ondokuAssignment;
};
