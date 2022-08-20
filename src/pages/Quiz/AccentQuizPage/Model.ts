import { User } from '../../../Model';
import { QuizScores } from '../../TempPage/service';

export type AccentQuizFormState = {
  users: User[];
  uid: string;
  title: string;
  scores: QuizScores;
  pitchStr: string;
  japanese: string;
  disabledsArray: number[][];
  downloadURL: string;
  ends: number[];
  starts: number[];
  questionCount: number;
};

export const INITIAL_ACCENT_QUIZ_FORM_STATE: AccentQuizFormState = {
  users: [],
  uid: '',
  title: '',
  scores: {},
  japanese: '',
  pitchStr: '',
  disabledsArray: [],
  downloadURL: '',
  starts: [],
  ends: [],
  questionCount: 0,
};
