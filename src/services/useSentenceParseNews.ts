import {
  query,
  where,
  orderBy,
  onSnapshot,
  collection,
  DocumentData,
} from '@firebase/firestore';
import { useEffect, useState } from 'react';
import { db } from '../repositories/firebase';
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

const COLLECTION = 'sentenceParseNews';

const colRef = collection(db, COLLECTION);

const buildSentenceParseNew = (doc: DocumentData) => {
  const sentenceParseNew: SentenceParseNew = {
    id: doc.id,
    line: doc.data().line,
    article: doc.data().article,
    sentence: doc.data().sentence,
    units: JSON.parse(doc.data().units),
    words: JSON.parse(doc.data().words),
    branches: JSON.parse(doc.data().branches),
    sentences: JSON.parse(doc.data().sentences),
    sentenceArrays: JSON.parse(doc.data().sentenceArrays),
    branchInvisibilities: JSON.parse(doc.data().branchInvisibilities),
    commentInvisibilities: JSON.parse(doc.data().commentInvisibilities),
  };
  return sentenceParseNew;
};

export const useSentenceParseNews = ({ article }: { article: Article }) => {
  const [sentenceParseNews, setSentenceParseNews] = useState<
    SentenceParseNew[]
  >([]);

  useEffect(() => {
    if (!article.id) return;
    const q = query(
      colRef,
      where('article', '==', article.id),
      orderBy('line')
    );
    const unsub = onSnapshot(
      q,
      (snapshot) => {
        console.log('snapshot sentence parses');
        const sentenceParseNews: SentenceParseNew[] = [];
        snapshot.forEach((doc) => {
          const sentenceParseNew = buildSentenceParseNew(doc);
          sentenceParseNews.push(sentenceParseNew);
        });
        setSentenceParseNews(sentenceParseNews);
      },
      (e) => {
        console.warn(e);
        setSentenceParseNews([]);
      }
    );
    return () => {
      unsub();
    };
  }, [article]);

  return { sentenceParseNews };
};
