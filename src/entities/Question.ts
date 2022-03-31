import { DocumentData } from '@firebase/firestore';
import { Tags } from './Tags';

export const INITIAL_QUESTION = {
  id: '',
  answerExample: '',
  answers: [''],
  choices: [],
  createdAt: 0,
  feedback: '',
  memo: '',
  note: '',
  question: '',
  questionGroup: '',
  tags: {},
  type: 'describe',
};

export type Question = {
  id: string;
  answerExample: string;
  answers: string[];
  choices: string[];
  createdAt: number;
  feedback: string;
  memo: string;
  note: string;
  question: string;
  questionGroup: string;
  tags: Tags;
  type: string;
};

export type CreateQuestion = Omit<Question, 'id'>;

export const buildQuestion = (id: string, data: DocumentData) => {
  const question: Question = {
    id,
    answerExample: data.answerExample,
    answers: data.answers,
    choices: data.choices,
    createdAt: data.createdAt,
    feedback: data.feedback,
    memo: data.memo,
    note: data.note,
    question: data.question,
    questionGroup: data.questionGroup,
    tags: data.tags,
    type: data.type,
  };
  return question;
};
