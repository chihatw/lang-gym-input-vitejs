import {
  buildQuestionSetScore,
  CreateQuestionSetScore,
} from '../entities/QuestionSetScore';
import { db } from './firebase';

const questionSetScoresRef = db.collection('questionSetScores');

export const getQuestionSetScore = async (id: string) => {
  try {
    console.log('get question set score');
    const snapshot = await questionSetScoresRef.doc(id).get();
    return buildQuestionSetScore(id, snapshot.data()!);
  } catch (e) {
    console.warn(e);
    return null;
  }
};

export const getQuestionSetScores = async (uid: string, limit: number) => {
  try {
    console.log('get question set scores');
    const snapshot = await questionSetScoresRef
      .where('uid', '==', uid)
      .orderBy('createdAt', 'desc')
      .limit(limit)
      .get();
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
    const docRef = questionSetScoresRef.doc();
    await questionSetScoresRef.doc(docRef.id).set(questionSetScore);
    return docRef.id;
  } catch (e) {
    console.warn(e);
    return '';
  }
};

export const deleteQuestionSetScoresByQuestionSetID = async (
  questionSetID: string
) => {
  const batch = db.batch();
  try {
    console.log('get question set scores');
    const snapshot = await questionSetScoresRef
      .where('questionSet', '==', questionSetID)
      .get();
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
