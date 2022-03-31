import { DocumentData } from '@firebase/firestore';

export type QuestionSet = {
  id: string;
  answered: boolean;
  createdAt: number;
  hasFreeAnswers: boolean;
  questionCount: number;
  questionGroups: string[];
  title: string;
  type: 'articleRhythms' | 'general' | 'articleAccents';
  uid: string;
  unlockedAt: number;
  userDisplayname: string;
};

export type CreateQuestionSet = Omit<QuestionSet, 'id'>;

export const buildQuestionSet = (id: string, data: DocumentData) => {
  const questionSet: QuestionSet = {
    id,
    answered: data.answered,
    createdAt: data.createdAt,
    hasFreeAnswers: data.hasFreeAnswers,
    questionCount: data.questionCount,
    questionGroups: data.questionGroups,
    title: data.title,
    type: data.type,
    uid: data.uid,
    unlockedAt: data.unlockedAt,
    userDisplayname: data.userDisplayname,
  };
  return questionSet;
};
