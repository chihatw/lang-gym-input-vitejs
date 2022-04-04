import { doc, collection, updateDoc, addDoc } from '@firebase/firestore';
import { Tags } from '../entities/Tags';
import { db } from '../repositories/firebase';

export type QuestionGroup = {
  id: string;
  tags: Tags; // will delete
  example: string;
  feedback: string;
  questions: string[];
  createdAt: number;
  explanation: string;
  hasFreeAnswers: boolean;
};

export const INITIAL_QUESTION_GROUP: QuestionGroup = {
  id: '',
  tags: {},
  example: '',
  feedback: '',
  questions: [],
  createdAt: 0,
  explanation: '',
  hasFreeAnswers: false,
};

const COLLECTION = 'questionGroups';
const colRef = collection(db, COLLECTION);
export const useQuestionGroups = () => {};

export const useHandleQuestionGroups = () => {
  const createInitialQuestionGroup =
    async (): Promise<QuestionGroup | null> => {
      const questionGroup: QuestionGroup = {
        ...INITIAL_QUESTION_GROUP,
        createdAt: Date.now(),
      };
      const { id, ...omitted } = questionGroup;
      console.log('create question group');
      return addDoc(colRef, { ...omitted })
        .then((doc) => {
          return {
            ...questionGroup,
            id: doc.id,
          };
        })
        .catch((e) => {
          console.warn(e);
          return null;
        });
    };
  const updateQuestionGroup = async (
    questionGroup: QuestionGroup
  ): Promise<{ success: boolean }> => {
    const { id, ...omitted } = questionGroup;
    return await updateDoc(doc(db, COLLECTION, id), { ...omitted })
      .then(() => {
        return { success: true };
      })
      .catch((e) => {
        console.warn(e);
        return { success: false };
      });
  };

  return { createInitialQuestionGroup, updateQuestionGroup };
};
