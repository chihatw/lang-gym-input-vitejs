import firebase from 'firebase/app';
import { Tags } from './Tags';

export type QuestionGroup = {
  id: string;
  createdAt: number;
  example: string;
  explanation: string;
  feedback: string;
  hasFreeAnswers: boolean;
  questions: string[];
  tags: Tags;
};

export type CreateQuestionGroup = Omit<QuestionGroup, 'id'>;

export const buildQuestionGroup = (
  id: string,
  data: firebase.firestore.DocumentData
) => {
  const questionGroup: QuestionGroup = {
    id,
    createdAt: data.createdAt,
    example: data.example,
    explanation: data.explanation,
    feedback: data.feedback,
    hasFreeAnswers: data.hasFreeAnswers,
    questions: data.questions,
    tags: data.tags,
  };
  return questionGroup;
};
