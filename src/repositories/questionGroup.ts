import {
  addDoc,
  collection,
  getDoc,
  doc,
  updateDoc,
  deleteDoc,
} from '@firebase/firestore';
import {
  buildQuestionGroup,
  CreateQuestionGroup,
  QuestionGroup,
} from '../entities/QuestionGroup';
import { db } from './firebase';

const COLLECTION = 'questionGroups';

const questionGroupsRef = collection(db, 'questionGroups');

export const getQuestionGroup = async (id: string) => {
  try {
    console.log('get question group');
    const snapshot = await getDoc(doc(db, COLLECTION, id));
    return buildQuestionGroup(id, snapshot.data()!);
  } catch (e) {
    console.warn(e);
    return null;
  }
};

export const createQuestionGroup = async (
  questionGroup: CreateQuestionGroup
) => {
  try {
    console.log('create question group');
    const docRef = await addDoc(questionGroupsRef, questionGroup);
    return { success: true, questionGroupID: docRef.id };
  } catch (e) {
    console.warn(e);
    return { success: false };
  }
};

export const updateQuestionGroup = async (questionGroup: QuestionGroup) => {
  try {
    console.log('update question group');
    const { id, ...omittedQuestionGroup } = questionGroup;
    await updateDoc(doc(db, COLLECTION, id), { ...omittedQuestionGroup });
    return { success: true };
  } catch (e) {
    console.warn(e);
    return { success: false };
  }
};

export const deleteQuestionGroup = async (id: string) => {
  try {
    console.log('delete question group');
    await deleteDoc(doc(db, COLLECTION, id));
    return { success: true };
  } catch (e) {
    console.warn(e);
    return { success: false };
  }
};
