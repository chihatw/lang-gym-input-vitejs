import {
  buildQuestionGroup,
  CreateQuestionGroup,
  QuestionGroup,
} from '../entities/QuestionGroup';
import { db } from './firebase';
const questionGroupsRef = db.collection('questionGroups');

export const getQuestionGroup = async (id: string) => {
  try {
    console.log('get question group');
    const doc = await questionGroupsRef.doc(id).get();
    return buildQuestionGroup(id, doc.data()!);
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
    const docRef = await questionGroupsRef.add(questionGroup);
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
    await questionGroupsRef.doc(id).update(omittedQuestionGroup);
    return { success: true };
  } catch (e) {
    console.warn(e);
    return { success: false };
  }
};

export const deleteQuestionGroup = async (id: string) => {
  try {
    console.log('delete question group');
    await questionGroupsRef.doc(id).delete();
    return { success: true };
  } catch (e) {
    console.warn(e);
    return { success: false };
  }
};
