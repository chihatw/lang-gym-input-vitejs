import firebase from 'firebase/app';
import {
  Assignment,
  buildAssignment,
  CreateAssignment,
} from '../entities/Assignment';
import { db } from './firebase';

const assignmentsRef = db.collection('assignments');

type Props = {
  uid: string;
  articleID?: string;
  ondokuID?: string;
};

export const getAssignment = async ({ uid, articleID, ondokuID }: Props) => {
  try {
    const query: firebase.firestore.Query = !!articleID
      ? assignmentsRef.where('article', '==', articleID)
      : assignmentsRef.where('ondoku', '==', ondokuID);
    console.log('get assignment');
    const snapshot = await query.where('uid', '==', uid).get();
    const doc = snapshot.docs[0];
    return buildAssignment(doc.id, doc.data());
  } catch (e) {
    console.warn(e);
    return null;
  }
};

export const createAssignment = async (assignment: CreateAssignment) => {
  try {
    console.log('create assignment');
    await assignmentsRef.add(assignment);
    return { success: true };
  } catch (e) {
    console.warn(e);
    return { success: false };
  }
};

export const updateAssignment = async (assignment: Assignment) => {
  try {
    const { id, ...omittedAssignment } = assignment;
    console.log('update assignment');
    await assignmentsRef.doc(id).update(omittedAssignment);
    return { success: true };
  } catch (e) {
    console.warn(e);
    return { success: false };
  }
};

export const deleteAssignment = async (id: string) => {
  try {
    console.log('delete assignment');
    await assignmentsRef.doc(id).delete();
    return { success: true };
  } catch (e) {
    console.warn(e);
    return { success: false };
  }
};

export const getAssignmentDownloadURL = async ({
  uid,
  articleID,
  ondokuID,
}: Props) => {
  try {
    return (await getAssignment({ uid, articleID, ondokuID }))!.downloadURL;
  } catch (e) {
    console.warn(e);
    return null;
  }
};
