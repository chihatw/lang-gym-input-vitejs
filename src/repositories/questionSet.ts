import {
  buildQuestionSet,
  CreateQuestionSet,
  QuestionSet,
} from '../entities/QuestionSet';
import { db } from './firebase';

const questionSetsRef = db.collection('questionSets');

export const getQuestionSet = async (id: string) => {
  try {
    console.log('get question set');
    const snapshot = await questionSetsRef.doc(id).get();
    return buildQuestionSet(id, snapshot.data()!);
  } catch (e) {
    console.warn(e);
    return null;
  }
};

export const getQuestionSets = async (limit: number, uid?: string) => {
  try {
    let query = questionSetsRef;
    if (!!uid) {
      query.where('uid', '==', uid);
    }
    console.log('get question sets');
    const snapshot = await query
      .orderBy('createdAt', 'desc')
      .limit(limit)
      .get();
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
    await questionSetsRef.doc(id).update(omittedQuestionSet);
    return { success: true };
  } catch (e) {
    console.warn(e);
    return { success: false };
  }
};

export const createQuestionSet = async (questionSet: CreateQuestionSet) => {
  try {
    console.log('create question set');
    const docRef = await questionSetsRef.add(questionSet);
    return { success: true, questionSetID: docRef.id };
  } catch (e) {
    console.warn(e);
    return { success: false };
  }
};

export const deleteQuestionSet = async (id: string) => {
  try {
    console.log('delete question set');
    await questionSetsRef.doc(id).delete();
    return { success: true };
  } catch (e) {
    console.log(e);
    return { success: false };
  }
};
