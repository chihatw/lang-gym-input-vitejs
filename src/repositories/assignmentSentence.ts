import {
  collection,
  startAfter,
  getDoc,
  getDocs,
  doc,
  query,
  where,
  limit,
  orderBy,
  addDoc,
  updateDoc,
  deleteDoc,
  writeBatch,
} from '@firebase/firestore';
import {
  AssignmentSentence,
  buildAssignmentSentence,
  CreateAssignmentSentence,
} from '../entities/AssignmentSentence';
import { db } from './firebase';

const COLLECTION = 'aSentences';

const assignmentSentencesRef = collection(db, COLLECTION);

type GetAssignmentSentenceProps = {
  uid: string;
  articleID?: string;
  ondokuID?: string;
  line: number;
};

export const getAssignmentSentence = async ({
  uid,
  articleID,
  ondokuID,
  line,
}: GetAssignmentSentenceProps) => {
  try {
    let q = !!articleID
      ? query(assignmentSentencesRef, where('article', '==', articleID))
      : query(assignmentSentencesRef, where('ondoku', '==', ondokuID));

    q = query(q, where('uid', '==', uid), where('line', '==', line));
    console.log('get assignment sentence');
    const snapshot = await getDocs(q);
    const doc = snapshot.docs[0];
    return buildAssignmentSentence(doc.id, doc.data());
  } catch (e) {
    console.warn(e);
    return null;
  }
};

type GetAssignmentSentencesProps = {
  uid: string;
  articleID?: string;
  ondokuID?: string;
};

export const getAssignmentSentences = async ({
  uid,
  articleID,
  ondokuID,
}: GetAssignmentSentencesProps) => {
  try {
    let q = !!articleID
      ? query(assignmentSentencesRef, where('article', '==', articleID))
      : query(assignmentSentencesRef, where('ondoku', '==', ondokuID));

    q = query(q, where('uid', '==', uid), orderBy('line'));

    console.log('get assignment sentences');
    const snapshot = await getDocs(q);
    const assignmentSentences = snapshot.docs.map((doc) =>
      buildAssignmentSentence(doc.id, doc.data())
    );

    return assignmentSentences;
  } catch (e) {
    console.warn(e);
    return null;
  }
};

export const createAssignmentSentenes = async (
  assignmentSentences: CreateAssignmentSentence[]
) => {
  const batch = writeBatch(db);
  try {
    assignmentSentences.forEach((aSentence) => {
      const docRef = doc(assignmentSentencesRef);
      batch.set(docRef, aSentence);
    });
    console.log('create assignment sentences');
    await batch.commit();
    return { success: true };
  } catch (e) {
    console.warn(e);
    return { success: false };
  }
};

export const updateAssignmentSentence = async (
  assignmentSentence: AssignmentSentence
) => {
  try {
    const { id, ...omittedAssignmentSentence } = assignmentSentence;
    console.log('update assignment sentence');
    await updateDoc(doc(db, COLLECTION, id), { ...omittedAssignmentSentence });
    return { success: true };
  } catch (e) {
    console.warn(e);
    return { success: false };
  }
};

export const updateAssignmentSentences = async (
  assignmentSentences: AssignmentSentence[]
) => {
  const batch = writeBatch(db);
  try {
    assignmentSentences.forEach((assignmentSentence) => {
      const { id, ...omittedAssignmentSentence } = assignmentSentence;

      batch.update(doc(db, COLLECTION, id), { ...omittedAssignmentSentence });
    });
    console.log('update assignment sentences');
    await batch.commit();
    return { success: true };
  } catch (e) {
    console.warn(e);
    return { success: false };
  }
};

export const deleteAssignmentSentences = async (ids: string[]) => {
  const batch = writeBatch(db);
  try {
    ids.forEach((id) => {
      batch.delete(doc(db, COLLECTION, id));
    });
    console.log('delete assignment sentences');
    await batch.commit();
    return { success: true };
  } catch (e) {
    console.warn(e);
    return { success: false };
  }
};
