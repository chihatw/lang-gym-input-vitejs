import {
  where,
  orderBy,
  DocumentData,
  QueryConstraint,
  Unsubscribe,
} from '@firebase/firestore';
import { useEffect, useMemo, useState } from 'react';
import { db } from '../repositories/firebase';
import {
  addDocument,
  snapshotCollection,
  updateDocument,
} from '../repositories/utils';

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

export const useSentenceParseNews = ({
  articleId,
  sentenceId,
}: {
  articleId: string;
  sentenceId: string;
}) => {
  const [sentenceParseNew, setSentenceParseNew] = useState(
    INITIAL_SENTENCE_PARSE_NEW
  );
  const [sentenceParseNews, setSentenceParseNews] = useState<
    SentenceParseNew[]
  >([]);

  const _snapshotCollection = useMemo(
    () =>
      function <T>({
        queries,
        setValues,
        buildValue,
      }: {
        queries?: QueryConstraint[];
        setValues: (value: T[]) => void;
        buildValue: (value: DocumentData) => T;
      }): Unsubscribe {
        return snapshotCollection({
          db,
          colId: COLLECTION,
          queries,
          setValues,
          buildValue,
        });
      },
    []
  );

  useEffect(() => {
    if (!sentenceId) {
      setSentenceParseNew(INITIAL_SENTENCE_PARSE_NEW);
    } else {
      const sentenceParseNew = sentenceParseNews.filter(
        (sentenceParseNew) => sentenceParseNew.sentence === sentenceId
      )[0];
      setSentenceParseNew(sentenceParseNew || INITIAL_SENTENCE_PARSE_NEW);
    }
  }, [sentenceId, sentenceParseNews]);

  useEffect(() => {
    if (!articleId) return;
    const unsub = _snapshotCollection({
      buildValue: buildSentenceParseNew,
      setValues: setSentenceParseNews,
      queries: [where('article', '==', articleId), orderBy('line')],
    });
    return () => {
      unsub();
    };
  }, [articleId]);

  return { sentenceParseNew, sentenceParseNews };
};

export const useHandleSentenceParseNews = () => {
  const _addDocument = useMemo(
    () =>
      async function <T extends { id: string }>(
        value: Omit<T, 'id'>
      ): Promise<T | null> {
        return await addDocument({
          db,
          colId: COLLECTION,
          value,
        });
      },
    []
  );

  const _updateDocument = useMemo(
    () =>
      async function <T extends { id: string }>(value: T): Promise<T | null> {
        return await updateDocument({
          db,
          colId: COLLECTION,
          value,
        });
      },
    []
  );

  const createSentenceParseNew = async (
    value: Omit<SentenceParseNew, 'id'>
  ) => {
    const stringified = {
      ...value,
      units: JSON.stringify(value.units),
      words: JSON.stringify(value.words),
      branches: JSON.stringify(value.branches),
      sentences: JSON.stringify(value.sentences),
      sentenceArrays: JSON.stringify(value.sentenceArrays),
      branchInvisibilities: JSON.stringify(value.branchInvisibilities),
      commentInvisibilities: JSON.stringify(value.commentInvisibilities),
    };

    return await _addDocument(stringified);
  };

  const updateSentenceParseNew = async (value: SentenceParseNew) => {
    const stringified = {
      ...value,
      units: JSON.stringify(value.units),
      words: JSON.stringify(value.words),
      branches: JSON.stringify(value.branches),
      sentences: JSON.stringify(value.sentences),
      sentenceArrays: JSON.stringify(value.sentenceArrays),
      branchInvisibilities: JSON.stringify(value.branchInvisibilities),
      commentInvisibilities: JSON.stringify(value.commentInvisibilities),
    };
    return await _updateDocument(stringified);
  };
  return { createSentenceParseNew, updateSentenceParseNew };
};

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
