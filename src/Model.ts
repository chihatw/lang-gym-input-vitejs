import { User as FirebaseUser } from 'firebase/auth';

export type Mark = {
  start: number;
  end: number;
};

export type Article = {
  id: string;
  uid: string;
  marks: string[];
  title: string;
  embedID: string;
  createdAt: number;
  downloadURL: string;
  isShowParse: boolean;
  hasRecButton: boolean;
  isShowAccents: boolean;
  userDisplayname: string;
};

export const INITIAL_ARTICLE: Article = {
  id: '',
  uid: '',
  marks: [],
  title: '',
  embedID: '',
  createdAt: 0,
  downloadURL: '',
  isShowParse: false,
  hasRecButton: false,
  isShowAccents: false,
  userDisplayname: '',
};

export type Tags = {
  [key: string]: boolean;
};

export type Accent = {
  moras: string[];
  pitchPoint: number;
};

export type ArticleSentence = {
  id: string;
  uid: string;
  end: number;
  tags: Tags;
  kana: string;
  line: number;
  start: number;
  title: string;
  accents: Accent[];
  article: string;
  chinese: string;
  japanese: string;
  original: string;
  createdAt: number;
  kanaAccentsStr: string;
  storagePath: string;
  storageDuration: number;
};

export const INITIAL_ARTICLE_SENTENCE: ArticleSentence = {
  id: '',
  uid: '',
  end: 0,
  tags: {},
  kana: '',
  line: 0,
  start: 0,
  title: '',
  accents: [],
  article: '',
  chinese: '',
  japanese: '',
  original: '',
  createdAt: 0,
  kanaAccentsStr: '',
  storagePath: '',
  storageDuration: 0,
};

export type User = {
  id: string;
  createdAt: number;
  displayname: string;
};

export const INITIAL_USER: User = {
  id: '',
  createdAt: 0,
  displayname: '',
};

export const TYPES = {
  articleAccents: 'articleAccents',
  articleRhythms: 'articleRhythms',
};

export type Syllable = {
  kana: string;
  longVowel: string;
  specialMora: string;
};

export type QuizScores = { [createdAt: number]: QuizScore };
export type QuizQuestions = { [index: number]: QuizQuestion };

export type Quiz = {
  id: string;
  uid: string;
  type: string;
  title: string;
  scores: QuizScores;
  questions: QuizQuestions;
  createdAt: number;
  downloadURL: string;
  questionCount: number;
};

export const INITIAL_QUIZ: Quiz = {
  id: '',
  uid: '',
  type: '',
  title: '',
  scores: {},
  questions: {},
  createdAt: 0,
  downloadURL: '',
  questionCount: 0,
};

export type QuizQuestion = {
  japanese: string; // pitchQuiz で利用
  pitchStr: string; // pitchQuiz で利用
  disableds: number[]; // pitchQuiz, rhythmQuiz の非題化を wordIndex で指定
  end: number; // rhythmQuiz で利用
  start: number; // rhythmQuiz で利用
  syllables: { [index: number]: Syllable[] }; // rhythmQuiz で利用
};

export type QuizScore = {
  score: number;
  createdAt: number;
  pitchAnswers: string[];
  rhythmAnswers: string[];
};

export const INITIAL_QUIZ_SCORE: QuizScore = {
  score: 0,
  createdAt: 0,
  pitchAnswers: [],
  rhythmAnswers: [],
};

export const INITIAL_QUIZ_QUESTION: QuizQuestion = {
  end: 0,
  start: 0,
  pitchStr: '',
  japanese: '',
  disableds: [],
  syllables: {},
};

export type WorkoutItem = {
  text: string;
  chinese: string;
  pitchesArray: string;
};

export type Workout = {
  id: string;
  beatCount: number;
  createdAt: number;
  createdAtStr: string;
  dateId: string;
  hidden: boolean;
  items: WorkoutItem[];
  label: string;
  uid: string;
};

export const INITIAL_WORKOUT: Workout = {
  id: '',
  beatCount: 0,
  createdAt: 0,
  createdAtStr: '',
  dateId: '',
  hidden: true,
  items: [],
  label: '',
  uid: '',
};

export type RandomWorkoutCue = {
  id: string;
  label: string;
  pitchStr: string;
  imagePath: string;
};

export const INITIAL_CUE: RandomWorkoutCue = {
  id: '',
  label: '',
  pitchStr: '',
  imagePath: '',
};

export type RandomWorkout = {
  id: string;
  uid: string;
  cues: RandomWorkoutCue[];
  title: string;
  cueIds: string[];
  beatCount: number;
  targetBpm: number;
  resultBpm: number;
  resultTime: number;
  roundCount: number;
  storagePath: string;
  recordCount: number;
};

export const INITIAL_RANDOM_WORKOUT: RandomWorkout = {
  id: '',
  uid: '',
  cues: [],
  title: '',
  cueIds: [],
  beatCount: 0,
  targetBpm: 0,
  resultBpm: 0,
  resultTime: 0,
  roundCount: 1,
  storagePath: '',
  recordCount: 0,
};

export type State = {
  user: FirebaseUser | null;
  initializing: boolean;
  isFetching: boolean;
  audioContext: AudioContext | null;
  users: User[];
  articleList: Article[];
  article: Article;
  sentences: ArticleSentence[];
  quizzes: Quiz[];
  blobs: { [downloadURL: string]: Blob };
  workout: Workout;
  workoutList: Workout[];
  randomWorkouts: { [workoutId: string]: RandomWorkout };
  randomWorkoutBlobs: { [workoutId: string]: Blob | null };
  memo: {
    articles: { [id: string]: Article };
    sentences: { [id: string]: ArticleSentence[] };
    workouts: { [id: string]: Workout };
  };
};

export const INITIAL_STATE: State = {
  user: null,
  initializing: true,
  isFetching: false,
  audioContext: null,
  users: [],
  articleList: [],
  article: INITIAL_ARTICLE,
  blobs: {},
  sentences: [],
  workout: INITIAL_WORKOUT,
  workoutList: [],
  randomWorkouts: {},
  randomWorkoutBlobs: {},
  quizzes: [],
  memo: {
    articles: {},
    sentences: {},
    workouts: {},
  },
};
