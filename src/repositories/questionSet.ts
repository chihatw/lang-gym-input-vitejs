import {
  collection,
  getDoc,
  doc,
  getDocs,
  where,
  orderBy,
  limit,
  query,
  updateDoc,
  addDoc,
  deleteDoc,
} from '@firebase/firestore';
import {
  buildQuestionSet,
  CreateQuestionSet,
  QuestionSet,
} from '../entities/QuestionSet';
import { db } from './firebase';

const COLLECTION = 'questionSets';

const questionSetsRef = collection(db, COLLECTION);

export const getQuestionSet = async (id: string) => {
  try {
    console.log('get question set');
    const snapshot = await getDoc(doc(db, COLLECTION, id));
    return buildQuestionSet(id, snapshot.data()!);
  } catch (e) {
    console.warn(e);
    return null;
  }
};

export const getQuestionSets = async (_limit: number, uid?: string) => {
  try {
    let q = query(questionSetsRef);
    if (!!uid) {
      q = query(q, where('uid', '==', uid));
    }
    console.log('get question sets');
    q = query(q, orderBy('createdAt', 'desc'), limit(_limit));
    const snapshot = await getDocs(q);
    const questionSets = snapshot.docs.map((doc) =>
      buildQuestionSet(doc.id, doc.data())
    );
    return questionSets;
  } catch (e) {
    console.warn(e);
    return [];
  }
};

export const updateQuestionSet = async (questionSet: QuestionSet) => {
  try {
    const { id, ...omittedQuestionSet } = questionSet;
    console.log('update question set');
    await updateDoc(doc(db, COLLECTION, id), { ...omittedQuestionSet });
    return { success: true };
  } catch (e) {
    console.warn(e);
    return { success: false };
  }
};

export const createQuestionSet = async (questionSet: CreateQuestionSet) => {
  try {
    console.log('create question set');
    const docRef = await addDoc(questionSetsRef, questionSet);
    return { success: true, questionSetID: docRef.id };
  } catch (e) {
    console.warn(e);
    return { success: false };
  }
};

export const deleteQuestionSet = async (id: string) => {
  try {
    console.log('delete question set');
    await deleteDoc(doc(db, COLLECTION, id));
    return { success: true };
  } catch (e) {
    console.log(e);
    return { success: false };
  }
};
