import {
  doc,
  query,
  where,
  addDoc,
  deleteDoc,
  updateDoc,
  onSnapshot,
  collection,
  DocumentData,
} from '@firebase/firestore';
import { useEffect, useState } from 'react';
import { Article } from './useArticles';
import { db } from '../repositories/firebase';

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
  useEffect(() => {
    if (!article.id) return;
    console.log(article.id);
    const q = query(colRef, where('article', '==', article.id));
    const unsub = onSnapshot(
      q,
      (snapshot) => {
        console.log('snapshot assignment');
        const doc = snapshot.docs[0];
        if (doc) {
          const assignment = buildAssignment(doc);
          setAssignment(assignment);
        } else {
          setAssignment(INITIAL_ASSIGNMENT);
        }
      },
      (e) => {
        console.warn(e);
        setAssignment(INITIAL_ASSIGNMENT);
      }
    );
    return () => {
      unsub();
    };
  }, [article]);
  return { assignment };
};
export const useHandleAssignments = () => {
  const createAssignment = async (
    assignment: Omit<Assignment, 'id'>
  ): Promise<{ success: boolean }> => {
    console.log('create assignment');
    return await addDoc(colRef, assignment)
      .then(() => {
        return { success: true };
      })
      .catch((e) => {
        console.warn(e);
        return { success: false };
      });
  };

  const updateAssignment = async (
    assignment: Assignment
  ): Promise<{ success: boolean }> => {
    const { id, ...omitted } = assignment;
    console.log('update assignment');
    return await updateDoc(doc(db, COLLECTION, id), { ...omitted })
      .then(() => {
        return { success: true };
      })
      .catch((e) => {
        console.warn(e);
        return { success: false };
      });
  };

  const deleteAssignment = async (
    assignmentId: string
  ): Promise<{ success: boolean }> => {
    return await deleteDoc(doc(db, COLLECTION, assignmentId))
      .then(() => {
        return { success: true };
      })
      .catch((e) => {
        console.warn(e);
        return { success: false };
      });
  };

  return { createAssignment, updateAssignment, deleteAssignment };
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
