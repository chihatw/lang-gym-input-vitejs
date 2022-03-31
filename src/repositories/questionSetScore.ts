import {
  collection,
  getDoc,
  doc,
  query,
  getDocs,
  where,
  orderBy,
  limit,
  setDoc,
  writeBatch,
} from '@firebase/firestore';
import {
  buildQuestionSetScore,
  CreateQuestionSetScore,
} from '../entities/QuestionSetScore';
import { db } from './firebase';

const COLLECTION = 'questionSetScores';

const questionSetScoresRef = collection(db, 'questionSetScores');

export const getQuestionSetScore = async (id: string) => {
  try {
    console.log('get question set score');
    const snapshot = await getDoc(doc(db, COLLECTION, id));
    return buildQuestionSetScore(id, snapshot.data()!);
  } catch (e) {
    console.warn(e);
    return null;
  }
};

export const getQuestionSetScores = async (uid: string, _limit: number) => {
  try {
    console.log('get question set scores');
    const q = query(
      questionSetScoresRef,
      where('uid', '==', uid),
      orderBy('createdAt', 'desc'),
      limit(_limit)
    );
    const snapshot = await getDocs(q);
    const questionSetScores = snapshot.docs.map((doc) =>
      buildQuestionSetScore(doc.id, doc.data())
    );
    return questionSetScores;
  } catch (e) {
    console.warn(e);
  }
};

export const createQuestionSetScore = async (
  questionSetScore: CreateQuestionSetScore
) => {
  try {
    console.log('create question set score');
    const docRef = doc(questionSetScoresRef);
    await setDoc(docRef, questionSetScore);
    return docRef.id;
  } catch (e) {
    console.warn(e);
    return '';
  }
};

export const deleteQuestionSetScoresByQuestionSetID = async (
  questionSetID: string
) => {
  const batch = writeBatch(db);
  try {
    console.log('get question set scores');
    const q = query(
      questionSetScoresRef,
      where('questionSet', '==', questionSetID)
    );
    const snapshot = await getDocs(q);
    if (!snapshot.empty) {
      snapshot.forEach((doc) => {
        batch.delete(doc.ref);
      });
      console.log('delete question set scores');
      await batch.commit();
      return { success: true };
    } else {
      throw new Error(`incorrect questionSetID: ${questionSetID}`);
    }
  } catch (e) {
    console.warn(e);
    return { success: false };
  }
};
