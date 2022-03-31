import { DocumentData } from '@firebase/firestore';

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

export const buildSentenceParseNew = (id: string, data: DocumentData) => {
  const sentenceParse: SentenceParseNew = {
    id,
    line: data.line,
    article: data.article,
    sentence: data.sentence,
    units: JSON.parse(data.units),
    words: JSON.parse(data.words),
    branches: JSON.parse(data.branches),
    sentences: JSON.parse(data.sentences),
    sentenceArrays: JSON.parse(data.sentenceArrays),
    branchInvisibilities: JSON.parse(data.branchInvisibilities),
    commentInvisibilities: JSON.parse(data.commentInvisibilities),
  };
  return sentenceParse;
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
