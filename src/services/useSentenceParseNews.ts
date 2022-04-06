import { Article } from './useArticles';

export type SentenceParseNew = {
  id: string;
  line: number;
  article: string;
  sentence: string;
  units: { [id: string]: Unit };
  words: { [id: string]: Word };
  branches: { [id: string]: Branch };
  sentences: { [id: string]: Sentence };
  sentenceArrays: string[][];
  branchInvisibilities: string[];
  commentInvisibilities: string[];
};

export type CreateSentenceParseNew = {
  line: number;
  article: string;
  sentence: string;
  units: string;
  words: string;
  branches: string;
  sentences: string;
  sentenceArrays: string;
  branchInvisibilities: string;
  commentInvisibilities: string;
};

export const INITIAL_SENTENCE_PARSE_NEW: SentenceParseNew = {
  id: '',
  line: 0,
  article: '',
  sentence: '',
  units: {},
  words: {},
  branches: {},
  sentences: {},
  sentenceArrays: [],
  branchInvisibilities: [],
  commentInvisibilities: [],
};

export type Unit = {
  id: string;
  wordID: string;
  branchIDs: string[];
};

export type Word = {
  id: string;
  text: string;
  hinshi: string;
};

export type Branch = {
  id: string;
  lock?: boolean;
  joshi:
    | {
        hasRentaiJoshi: boolean;
      }
    | {
        kakuJoshi: string;
        kakariJoshi: string;
      };
  unitID: string;
};

export type Sentence = {
  id: string;
  topic: string;
  comments: string[];
  shuuJoshi: string;
  juntaiJoshi: string;
  buntouSeibuns: string[];
  setsuzokuJoshis: { [id: string]: string };
  juntaiJoshiBunmatsu: string;
};

export const INITIAL_SENTENCE: Sentence = {
  id: '',
  topic: '',
  comments: [],
  shuuJoshi: '',
  juntaiJoshi: '',
  buntouSeibuns: [],
  setsuzokuJoshis: {},
  juntaiJoshiBunmatsu: '',
};

export const useSentenceParseNews = ({ article }: { article: Article }) => {};
