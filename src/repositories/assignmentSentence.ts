import {
  AssignmentSentence,
  buildAssignmentSentence,
  CreateAssignmentSentence,
} from '../entities/AssignmentSentence';
import { db } from './firebase';

const assignmentSentencesRef = db.collection('aSentences');

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
    const query = !!articleID
      ? assignmentSentencesRef.where('article', '==', articleID)
      : assignmentSentencesRef.where('ondoku', '==', ondokuID);
    console.log('get assignment sentence');
    const snapshot = await query
      .where('uid', '==', uid)
      .where('line', '==', line)
      .get();
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
    const query = !!articleID
      ? assignmentSentencesRef.where('article', '==', articleID)
      : assignmentSentencesRef.where('ondoku', '==', ondokuID);
    console.log('get assignment sentences');
    const snapshot = await query.where('uid', '==', uid).orderBy('line').get();
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
  const batch = db.batch();
  try {
    assignmentSentences.forEach((s) => {
      batch.set(assignmentSentencesRef.doc(), s, { merge: false });
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
    await assignmentSentencesRef.doc(id).update(omittedAssignmentSentence);
    return { success: true };
  } catch (e) {
    console.warn(e);
    return { success: false };
  }
};

export const updateAssignmentSentences = async (
  assignmentSentences: AssignmentSentence[]
) => {
  const batch = db.batch();
  try {
    assignmentSentences.forEach((assignmentSentence) => {
      const { id, ...omittedAssignmentSentence } = assignmentSentence;
      batch.update(assignmentSentencesRef.doc(id), omittedAssignmentSentence);
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
  const batch = db.batch();
  try {
    ids.forEach((id) => {
      batch.delete(assignmentSentencesRef.doc(id));
    });
    console.log('delete assignment sentences');
    await batch.commit();
    return { success: true };
  } catch (e) {
    console.warn(e);
    return { success: false };
  }
};
