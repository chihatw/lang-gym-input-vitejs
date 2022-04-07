import { useEffect, useState } from 'react';
import {
  doc,
  query,
  where,
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
import { Article } from './useArticles';

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

export const useSentences = ({ article }: { article: Article }) => {
  const [sentences, setSentences] = useState<Sentence[]>([]);
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
  }, [article]);
  return { sentences };
};

export const useHandleSentences = () => {
  const updateSentence = async (
    sentence: Sentence
  ): Promise<{ success: boolean }> => {
    const { id, ...omitted } = sentence;
    console.log('update sentence');
    return await updateDoc(doc(db, COLLECTION, id), { ...omitted })
      .then(() => {
        return { success: true };
      })
      .catch((e) => {
        console.warn(e);
        return { success: false };
      });
  };

  const createSentences = async (
    sentences: Omit<Sentence, 'id'>[]
  ): Promise<{ success: boolean }> => {
    const batch = writeBatch(db);

    sentences.forEach((sentence) => {
      const docRef = doc(colRef);
      batch.set(docRef, sentence);
    });
    console.log('create sentences');
    return await batch
      .commit()
      .then(() => {
        return { success: true };
      })
      .catch((e) => {
        console.warn(e);
        return { success: false };
      });
  };

  const updateSentences = async (
    sentences: Sentence[]
  ): Promise<{ success: boolean }> => {
    const batch = writeBatch(db);
    sentences.forEach((sentence) => {
      const { id, ...omitted } = sentence;
      batch.update(doc(db, COLLECTION, id), { ...omitted });
    });
    console.log('update sentences');
    return await batch
      .commit()
      .then(() => {
        return { success: true };
      })
      .catch((e) => {
        console.warn(e);
        return { success: false };
      });
  };
  const deleteSentences = async (
    articleId: string
  ): Promise<{ success: boolean }> => {
    console.log('get sentences');
    const q = query(colRef, where('article', '==', articleId));
    const snapshot = await getDocs(q);

    const batch = writeBatch(db);
    snapshot.forEach((doc) => {
      batch.delete(doc.ref);
    });
    console.log('delete sentences');
    return await batch
      .commit()
      .then(() => {
        return { success: true };
      })
      .catch((e) => {
        console.warn(e);
        return { success: false };
      });
  };
  return { updateSentence, createSentences, updateSentences, deleteSentences };
};

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
