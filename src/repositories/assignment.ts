import {
  collection,
  getDocs,
  doc,
  query,
  where,
  addDoc,
  updateDoc,
  deleteDoc,
} from '@firebase/firestore';
import {
  Assignment,
  buildAssignment,
  CreateAssignment,
} from '../entities/Assignment';
import { db } from './firebase';

const COLLECTION = 'assignments';

const assignmentsRef = collection(db, COLLECTION);

type Props = {
  uid: string;
  articleID?: string;
  ondokuID?: string;
};

export const getAssignment = async ({ uid, articleID, ondokuID }: Props) => {
  try {
    let q = !!articleID
      ? query(assignmentsRef, where('article', '==', articleID))
      : query(assignmentsRef, where('ondoku', '==', ondokuID));

    q = query(q, where('uid', '==', uid));
    console.log('get assignment');
    const snapshot = await getDocs(q);
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
    await addDoc(assignmentsRef, assignment);
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
    await updateDoc(doc(db, COLLECTION, id), { ...omittedAssignment });
    return { success: true };
  } catch (e) {
    console.warn(e);
    return { success: false };
  }
};

export const deleteAssignment = async (id: string) => {
  try {
    console.log('delete assignment');
    await deleteDoc(doc(db, COLLECTION, id));
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
