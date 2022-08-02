import { Audio, Rhythm, User } from '../../../Model';

export type RhythmQuizState = {
  uid: string;
  users: User[];
  title: string;
  audios: Audio[];
  quizBlob: Blob | null;
  answered: boolean;
  rhythmArray: Rhythm[][][];
  audioContext: AudioContext | null;
  rhythmString: string;
  disabledsArray: string[][][];
  questionCount: number;
};

export const INITIAL_RHYTHM_QUIZ_STATE: RhythmQuizState = {
  uid: '',
  users: [],
  title: '',
  audios: [],
  answered: false,
  rhythmArray: [],
  disabledsArray: [],
  quizBlob: null,
  audioContext: null,
  rhythmString: '',
  questionCount: 0,
};
