import { useEffect, useState } from 'react';
import {
  doc,
  query,
  where,
  limit,
  getDoc,
  getDocs,
  orderBy,
  updateDoc,
  writeBatch,
  collection,
  onSnapshot,
  DocumentData,
} from '@firebase/firestore';

import { db } from '../repositories/firebase';
import { Tags } from '../entities/Tags';
import { Accent } from '../entities/Accent';

const COLLECTION = 'sentences';
const colRef = collection(db, COLLECTION);

export type Sentence = {
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
};

export const INITIAL_SENTENCE: Sentence = {
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
};

export const useSentences = ({
  articleId,
  sentenceId,
}: {
  articleId: string;
  sentenceId: string;
}) => {
  const [sentence, setSentence] = useState(INITIAL_SENTENCE);
  const [sentences, setSentences] = useState<Sentence[]>([]);
  useEffect(() => {
    if (!articleId) return;
    const q = query(colRef, where('article', '==', articleId), orderBy('line'));
    const unsub = onSnapshot(
      q,
      (snapshot) => {
        console.log('snapshot sentences');
        const sentences: Sentence[] = [];
        snapshot.forEach((doc) => {
          const sentence = buildSentence(doc);
          sentences.push(sentence);
        });
        setSentences(sentences);
      },
      (e) => {
        console.warn(e);
        setSentences([]);
      }
    );
    return () => {
      unsub();
    };
  }, [articleId]);
  return { sentence, sentences };
};

export const useHandleSentences = () => {};

const buildSentence = (doc: DocumentData) => {
  const sentence: Sentence = {
    id: doc.id,
    uid: doc.data().uid,
    end: doc.data().end,
    tags: doc.data().tags,
    kana: doc.data().kana,
    line: doc.data().line,
    start: doc.data().start,
    title: doc.data().title,
    accents: doc.data().accents,
    article: doc.data().article,
    chinese: doc.data().chinese,
    japanese: doc.data().japanese,
    original: doc.data().original,
    createdAt: doc.data().createdAt,
  };
  return sentence;
};
