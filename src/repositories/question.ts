import { buildQuestion, CreateQuestion, Question } from '../entities/Question';
import { db } from './firebase';

const questionsRef = db.collection('questions');

export const getQuestion = async (id: string) => {
  try {
    console.log('get question');
    const snapshot = await questionsRef.doc(id).get();
    return buildQuestion(id, snapshot.data()!);
  } catch (e) {
    console.warn(e);
    return null;
  }
};

export const createQuestions = async (questions: CreateQuestion[]) => {
  const docIDs: string[] = [];
  const batch = db.batch();
  try {
    questions.forEach((q) => {
      const docRef = questionsRef.doc();
      docIDs.push(docRef.id);
      batch.set(docRef, q, { merge: false });
    });
    await batch.commit();
    return docIDs;
  } catch (e) {
    console.warn(e);
    return [];
  }
};

export const createQuestionsWithID = async (questions: Question[]) => {
  const batch = db.batch();
  try {
    questions.forEach((q) => {
      const { id, ...omittedQuestion } = q;
      batch.set(questionsRef.doc(id), omittedQuestion, { merge: false });
    });
    await batch.commit();
    return { success: true };
  } catch (e) {
    console.warn(e);
    return { success: false };
  }
};

export const updateQuestions = async (questions: Question[]) => {
  const batch = db.batch();
  try {
    questions.forEach((q) => {
      const { id, ...omittedQuestion } = q;
      batch.update(questionsRef.doc(id), omittedQuestion);
    });
    console.log('update questions');
    await batch.commit();
    return { success: true };
  } catch (e) {
    console.warn(e);
    return { success: false };
  }
};

export const deleteQuestions = async (ids: string[]) => {
  const batch = db.batch();
  try {
    ids.forEach((id) => {
      batch.delete(questionsRef.doc(id));
    });
    console.log('delete questions');
    await batch.commit();
    return { success: true };
  } catch (e) {
    console.warn(e);
    return { success: false };
  }
};
