import { FSentences } from 'fsentence-types';

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
  isFetching: boolean;
  users: User[];
  article: Article;
  articleList: Article[];
  sentences: ArticleSentence[];
  articleSentenceForms: ArticleSentenceForm[];
  workout: Workout;
  workoutList: Workout[];
  memo: {
    articles: { [id: string]: Article };
    workouts: { [id: string]: Workout };
    sentences: { [id: string]: ArticleSentence[] };
    articleSentenceForms: { [id: string]: ArticleSentenceForm[] };
  };
};

export const INITIAL_STATE: State = {
  isFetching: false,
  users: [],
  article: INITIAL_ARTICLE,
  articleList: [],
  sentences: [],
  articleSentenceForms: [],
  workout: INITIAL_WORKOUT,
  workoutList: [],
  memo: {
    articles: {},
    workouts: {},
    sentences: {},
    articleSentenceForms: {},
  },
};
