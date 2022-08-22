import { User, QuizScores, QuizQuestion } from '../../../Model';

export type RhythmQuizFromState = {
  uid: string;
  blob: Blob | null;
  users: User[];
  title: string;
  questionCount: number;
  input: {
    kana: string;
  };
  questions: QuizQuestion[];
  scores: QuizScores;
  audioContext: AudioContext | null;
};

export const INITIAL_RHYTHM_QUIZ_FORM_STATE: RhythmQuizFromState = {
  uid: '',
  blob: null,
  users: [],
  title: '',
  questionCount: 0,
  input: {
    kana: '',
  },
  questions: [],
  scores: {},
  audioContext: null,
};
