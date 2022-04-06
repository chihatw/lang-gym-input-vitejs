import {
  doc,
  query,
  where,
  getDocs,
  orderBy,
  updateDoc,
  collection,
} from '@firebase/firestore';
import { buildAssignmentSentence } from '../entities/AssignmentSentence';
import { AssignmentSentence } from '../services/useAssignmentSentences';
import { db } from './firebase';

const COLLECTION = 'aSentences';

const assignmentSentencesRef = collection(db, COLLECTION);

export const getAssignmentSentence = async ({
  uid,
  articleID,
  ondokuID,
  line,
}: {
  uid: string;
  articleID?: string;
  ondokuID?: string;
  line: number;
}) => {
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
