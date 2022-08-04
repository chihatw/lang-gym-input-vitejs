import { User as FirebaseUser } from 'firebase/auth';
import { FSentences } from 'fsentence-types';

export type Mark = {
  start: number;
  end: number;
};

export type SpecialMora = 'っ' | 'ん' | 'ー' | 'ーん' | 'ーっ';

export type Rhythm = {
  mora: SpecialMora & '';
  index: number;
  syllable: string;
  disabled: SpecialMora & '' & 'x';
  longVowel?: string;
};

export type Audio = {
  start: number;
  end: number;
  downloadURL: string;
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

export type ArticleSentenceForm = {
  id: string;
  lineIndex: number;
  articleId: string;
  sentences: FSentences;
};

export const INITIAL_ARTICLE_SENTENCE_FORM: ArticleSentenceForm = {
  id: '',
  lineIndex: 0,
  articleId: '',
  sentences: {},
};

export type QuestionSet = {
  id: string;
  uid: string;
  type: 'articleRhythms' | 'general' | 'articleAccents';
  title: string;
  answered: boolean;
  createdAt: number;
  unlockedAt: number;
  questionCount: number;
  hasFreeAnswers: boolean;
  questionGroups: string[];
  userDisplayname: string;
};

export const INITIAL_QUESTION_SET: QuestionSet = {
  id: '',
  uid: '',
  type: 'articleAccents',
  title: '',
  answered: false,
  createdAt: 0,
  unlockedAt: 0,
  questionCount: 0,
  hasFreeAnswers: false,
  questionGroups: [],
  userDisplayname: '',
};

export type QuestionGroup = {
  id: string;
  tags: Tags; // will delete
  example: string;
  feedback: string;
  questions: string[];
  createdAt: number;
  explanation: string;
  hasFreeAnswers: boolean;
};

export const INITIAL_QUESTION_GROUP: QuestionGroup = {
  id: '',
  tags: {},
  example: '',
  feedback: '',
  questions: [],
  createdAt: 0,
  explanation: '',
  hasFreeAnswers: false,
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

export const INITIAL_QUESTION: Question = {
  id: '',
  tags: {},
  memo: '',
  note: '',
  type: 'describe',
  answers: [''],
  choices: [],
  feedback: '',
  question: '',
  createdAt: 0,
  answerExample: '',
  questionGroup: '',
};

export type User = {
  id: string;
  createdAt: number;
  displayname: string;
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

export type State = {
  user: FirebaseUser | null;
  initializing: boolean;
  isFetching: boolean;
  audioContext: AudioContext | null;
  users: User[];
  articleList: Article[];
  article: Article;
  articleBlob: Blob | null;
  sentences: ArticleSentence[];
  articleSentenceForms: ArticleSentenceForm[];
  quizList: QuestionSet[];
  quiz: QuestionSet;
  quizBlob: Blob | null;
  questions: Question[];
  workout: Workout;
  workoutList: Workout[];
  memo: {
    articles: { [id: string]: Article };
    articleBlobs: { [id: string]: Blob | null };
    sentences: { [id: string]: ArticleSentence[] };
    articleSentenceForms: { [id: string]: ArticleSentenceForm[] };
    quizzes: { [id: string]: QuestionSet };
    quizBlobs: { [id: string]: Blob | null };
    questions: { [id: string]: Question[] };
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
  articleBlob: null,
  sentences: [],
  articleSentenceForms: [],
  quizList: [],
  quiz: INITIAL_QUESTION_SET,
  quizBlob: null,
  questions: [],
  workout: INITIAL_WORKOUT,
  workoutList: [],
  memo: {
    articles: {},
    articleBlobs: {},
    sentences: {},
    articleSentenceForms: {},
    quizzes: {},
    quizBlobs: {},
    questions: {},
    workouts: {},
  },
};
