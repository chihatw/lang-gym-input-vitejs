import { collection, writeBatch, doc, getDoc } from '@firebase/firestore';
import { buildQuestion, CreateQuestion, Question } from '../entities/Question';
import { db } from './firebase';

const COLLECTION = 'questions';

const questionsRef = collection(db, 'questions');

export const getQuestion = async (id: string) => {
  try {
    console.log('get question');
    const snapshot = await getDoc(doc(db, COLLECTION, id));
    return buildQuestion(id, snapshot.data()!);
  } catch (e) {
    console.warn(e);
    return null;
  }
};

export const createQuestions = async (questions: CreateQuestion[]) => {
  const docIDs: string[] = [];
  const batch = writeBatch(db);
  try {
    questions.forEach((question) => {
      const docRef = doc(questionsRef);
      docIDs.push(docRef.id);
      batch.set(docRef, question);
    });
    await batch.commit();
    return docIDs;
  } catch (e) {
    console.warn(e);
    return [];
  }
};

export const createQuestionsWithID = async (questions: Question[]) => {
  const batch = writeBatch(db);
  try {
    questions.forEach((q) => {
      const { id, ...omittedQuestion } = q;
      batch.set(doc(db, COLLECTION, id), { ...omittedQuestion });
    });
    await batch.commit();
    return { success: true };
  } catch (e) {
    console.warn(e);
    return { success: false };
  }
};

export const updateQuestions = async (questions: Question[]) => {
  const batch = writeBatch(db);
  try {
    questions.forEach((question) => {
      const { id, ...omittedQuestion } = question;
      batch.update(doc(db, COLLECTION, id), { ...omittedQuestion });
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
  const batch = writeBatch(db);
  try {
    ids.forEach((id) => {
      batch.delete(doc(db, COLLECTION, id));
    });
    console.log('delete questions');
    await batch.commit();
    return { success: true };
  } catch (e) {
    console.warn(e);
    return { success: false };
  }
};
