import {
  doc,
  where,
  orderBy,
  updateDoc,
  collection,
  writeBatch,
  DocumentData,
  QueryConstraint,
  Unsubscribe,
} from '@firebase/firestore';
import { useEffect, useMemo, useState } from 'react';
import { Accent } from '../entities/Accent';
import { db } from '../repositories/firebase';
import { snapshotCollection } from '../repositories/utils';
import { Article } from './useArticles';

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
const colRef = collection(db, COLLECTION);

export const useAssignmentSentences = ({ article }: { article: Article }) => {
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
    if (!article.id) return;

    const unsub = _snapshotCollection({
      queries: [where('article', '==', article.id), orderBy('line')],
      setValues: setAssignmentSentences,
      buildValue: buildAssignmentSentence,
    });

    return () => {
      unsub();
    };
  }, [article]);
  return { assignmentSentences };
};
export const useHandleAssignmentSentences = () => {
  const updateAssignmentSentence = async (
    assignmentSentences: AssignmentSentence
  ): Promise<{ success: boolean }> => {
    const { id, ...omitted } = assignmentSentences;
    console.log('update assignment sentence');
    return updateDoc(doc(db, COLLECTION, id), { ...omitted })
      .then(() => {
        return { success: true };
      })
      .catch((e) => {
        console.warn(e);
        return { success: false };
      });
  };

  const createAssignmentSentences = async (
    assignmentSentences: Omit<AssignmentSentence, 'id'>[]
  ): Promise<{
    success: boolean;
  }> => {
    const batch = writeBatch(db);
    assignmentSentences.forEach((aSentence) => {
      const docRef = doc(colRef);
      batch.set(docRef, aSentence);
    });
    console.log('create assignment sentences');
    return await batch
      .commit()
      .then(() => {
        return { success: true };
      })
      .catch((e) => {
        console.warn(e);
        return { success: false };
      });
  };
  const updateAssignmentSentences = async (
    assignmentSentences: AssignmentSentence[]
  ): Promise<{ success: boolean }> => {
    const batch = writeBatch(db);
    assignmentSentences.forEach((assignmentSentence) => {
      const { id, ...omitted } = assignmentSentence;
      batch.update(doc(db, COLLECTION, id), { ...omitted });
    });
    console.log('update assignment sentences');
    return await batch
      .commit()
      .then(() => {
        return { success: true };
      })
      .catch((e) => {
        console.warn(e);
        return { success: false };
      });
  };
  const deleteAssignmentSentences = async (
    ids: string[]
  ): Promise<{ success: boolean }> => {
    const batch = writeBatch(db);

    ids.forEach((id) => {
      batch.delete(doc(db, COLLECTION, id));
    });
    console.log('delete assignment sentences');
    return await batch
      .commit()
      .then(() => {
        return { success: true };
      })
      .catch((e) => {
        console.warn(e);
        return { success: false };
      });
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
