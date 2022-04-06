import {
  doc,
  query,
  where,
  getDocs,
  orderBy,
  updateDoc,
  collection,
  writeBatch,
  onSnapshot,
  DocumentData,
} from '@firebase/firestore';
import { useEffect, useState } from 'react';
import { Accent } from '../entities/Accent';
import { buildAssignment } from '../entities/Assignment';
import { db } from '../repositories/firebase';
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

export const useAssignmentSentences = ({ article }: { article: Article }) => {
  const [assignmentSentences, setAssignmentSentences] = useState<
    AssignmentSentence[]
  >([]);
  useEffect(() => {
    if (!article.id) return;
    const q = query(
      colRef,
      where('article', '==', article.id),
      orderBy('line')
    );
    const unsub = onSnapshot(
      q,
      (snapshot) => {
        console.log('snapshot assignment sentence');
        const assignmentSentences: AssignmentSentence[] = [];
        snapshot.forEach((doc) => {
          const assignmentSentence = buildAssignmentSentence(doc);
          assignmentSentences.push(assignmentSentence);
        });
        setAssignmentSentences(assignmentSentences);
      },
      (e) => {
        console.warn(e);
        setAssignmentSentences([]);
      }
    );

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
