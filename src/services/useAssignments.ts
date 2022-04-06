import {
  query,
  onSnapshot,
  collection,
  DocumentData,
  where,
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
export const useHandleAssignments = () => {};

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
