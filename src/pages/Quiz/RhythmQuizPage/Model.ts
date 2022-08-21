import { User, QuizScores, Syllable } from '../../../Model';

export type RhythmQuizFromState = {
  uid: string;
  ends: number[];
  users: User[];
  title: string;
  scores: QuizScores;
  starts: number[];
  quizBlob: Blob | null;
  rhythmArray: Syllable[][][];
  rhythmString: string;
  audioContext: AudioContext | null;
  questionCount: number;
};

export const INITIAL_RHYTHM_QUIZ_FORM_STATE: RhythmQuizFromState = {
  uid: '',
  ends: [],
  starts: [],
  users: [],
  title: '',
  scores: {},
  rhythmArray: [],
  quizBlob: null,
  audioContext: null,
  rhythmString: '',
  questionCount: 0,
};
