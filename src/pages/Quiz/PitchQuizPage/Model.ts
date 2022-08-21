import { User } from '../../../Model';
import { QuizQuestion, QuizScores } from '../../TempPage/service';

export type PitchQuizFormState = {
  uid: string;
  blob: Blob | null;
  users: User[];
  title: string;
  questionCount: number;
  input: {
    pitch: string;
    japanese: string;
  };
  questions: QuizQuestion[];
  scores: QuizScores;
  audioContext: AudioContext | null;
};

export const INITIAL_PITCH_QUIZ_FORM_STATE: PitchQuizFormState = {
  uid: '',
  blob: null,
  users: [],
  title: '',
  questionCount: 0,
  input: {
    pitch: '',
    japanese: '',
  },
  questions: [],
  scores: {},
  audioContext: null,
};
