import { useCallback } from 'react';
import {
  batchDeleteDocuments,
  getDocumentsByQuery,
} from '../repositories/utils';
import { db } from '../repositories/firebase';
import { DocumentData, QueryConstraint, where } from 'firebase/firestore';

export type QuestionSetScore = {
  id: string;
  answers: { [key: string]: string };
  createdAt: number;
  isChecking: boolean;
  questionSet: string;
  score: number;
  uid: string;
};

export const INITIAL_QUESTION_SET_SCORE: QuestionSetScore = {
  id: '',
  answers: {},
  createdAt: 0,
  isChecking: false,
  questionSet: '',
  score: 0,
  uid: '',
};

const COLLECTION = 'questionSetScores';

export const useQuestionSetScores = () => {};
export const useHandleQuestionSetScores = () => {
  const _getDocumentsByQuery = async <T>({
    queries,
    buildValue,
  }: {
    queries?: QueryConstraint[];
    buildValue: (value: DocumentData) => T;
  }): Promise<T[]> => {
    return await getDocumentsByQuery({
      db,
      colId: COLLECTION,
      queries,
      buildValue,
    });
  };

  const _batchDeleteDocuments = useCallback(async (ids: string[]) => {
    return await batchDeleteDocuments({ db, colId: COLLECTION, ids });
  }, []);

  const deleteQuestionSetScoresByQuestionSetId = async (
    questionSetId: string
  ): Promise<boolean> => {
    const ids = await _getDocumentsByQuery({
      queries: [where('questionSet', '==', questionSetId)],
      buildValue: (doc: DocumentData) => doc.id as string,
    });

    return await _batchDeleteDocuments(ids);
  };

  return { deleteQuestionSetScoresByQuestionSetId };
};

const buildQuestionSetScore = (doc: DocumentData) => {
  const questionSetScore: QuestionSetScore = {
    id: doc.id,
    answers: doc.data().answers,
    createdAt: doc.data().createdAt,
    isChecking: doc.data().isChecking,
    questionSet: doc.data().questionSet,
    score: doc.data().score,
    uid: doc.data().uid,
  };
  return questionSetScore;
};
