import { addDoc, collection } from '@firebase/firestore';
import { Accent } from '../entities/Accent';
import { db } from '../repositories/firebase';

export type QuestionSet = {
  id: string;
  uid: string;
  type: 'articleRhythms' | 'general' | 'articleAccents';
  title: string;
  answered: boolean;
  createdAt: number;
  unlockedAt: number;
  questionCount: number;
  hasFreeAnswers: boolean;
  questionGroups: string[];
  userDisplayname: string;
};

export const INITIAL_QUESTION_SET: QuestionSet = {
  id: '',
  uid: '',
  type: 'articleAccents',
  title: '',
  answered: false,
  createdAt: 0,
  unlockedAt: 0,
  questionCount: 0,
  hasFreeAnswers: false,
  questionGroups: [],
  userDisplayname: '',
};

const COLLECTION = 'questionSets';
const colRef = collection(db, COLLECTION);

export const useQuestionSets = () => {};
export const useHandleQuestionSets = () => {
  const createRhythmQuestionSet = async ({
    title,
    accentsArray,
    questionGroupId,
  }: {
    title: string;
    accentsArray: Accent[][];
    questionGroupId: string;
  }): Promise<{ questionSetID: string }> => {
    let questionCount = 0;
    accentsArray.forEach((accents) => {
      questionCount += accents.length;
    });
    const questionSet: Omit<QuestionSet, 'id'> = {
      uid: import.meta.env.VITE_ADMIN_UID,
      type: 'articleRhythms',
      title: `${title} - 特殊拍`,
      answered: false,
      createdAt: new Date().getTime(),
      unlockedAt: new Date().getTime(),
      questionCount,
      hasFreeAnswers: false,
      questionGroups: [questionGroupId],
      userDisplayname: '原田',
    };
    console.log('create question set');
    return await addDoc(colRef, questionSet)
      .then((doc) => {
        return { questionSetID: doc.id };
      })
      .catch((e) => {
        console.warn(e);
        return { questionSetID: '' };
      });
  };
  return { createRhythmQuestionSet };
};
