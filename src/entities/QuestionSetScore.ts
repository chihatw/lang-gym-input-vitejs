import firebase from 'firebase/app';
export type QuestionSetScore = {
  id: string;
  answers: { [key: string]: string };
  createdAt: number;
  isChecking: boolean;
  questionSet: string;
  score: number;
  uid: string;
};

export type CreateQuestionSetScore = Omit<QuestionSetScore, 'id'>;

export const buildQuestionSetScore = (
  id: string,
  data: firebase.firestore.DocumentData
) => {
  const questionSetScore: QuestionSetScore = {
    id,
    answers: data.answers,
    createdAt: data.createdAt,
    isChecking: data.isChecking,
    questionSet: data.questionSet,
    score: data.score,
    uid: data.uid,
  };
  return questionSetScore;
};
