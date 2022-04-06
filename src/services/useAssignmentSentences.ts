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
export const useHandleAssignmentSentences = () => {};
