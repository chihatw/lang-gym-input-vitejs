import { mora2Vowel } from 'mora2vowel';

import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  where,
  orderBy,
  DocumentData,
  QueryConstraint,
  Unsubscribe,
} from '@firebase/firestore';

import { db } from '../repositories/firebase';
import { Tags } from '../entities/Tags';
import { Accent } from '../entities/Accent';
import {
  batchAddDocuments,
  batchDeleteDocuments,
  batchUpdateDocuments,
  getDocumentsByQuery,
  snapshotCollection,
  updateDocument,
} from '../repositories/utils';
import getMoras from 'get-moras';

const COLLECTION = 'sentences';

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

export const useSentences = (articleId: string) => {
  const [sentences, setSentences] = useState<ArticleSentence[]>([]);

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
    if (!articleId) return;
    const unsub = _snapshotCollection({
      queries: [where('article', '==', articleId), orderBy('line')],
      buildValue: buildSentence,
      setValues: setSentences,
    });
    return () => {
      unsub();
    };
  }, [articleId]);
  return { sentences };
};

export const useHandleSentences = () => {
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

  const _batchAddDocuments = useMemo(
    () =>
      async function <T extends { id: string }>(
        values: Omit<T, 'id'>[]
      ): Promise<string[]> {
        return await batchAddDocuments({ db, colId: COLLECTION, values });
      },
    []
  );

  const _batchUpdateDocuments = useMemo(
    () =>
      async function <T extends { id: string }>(values: T[]): Promise<boolean> {
        return await batchUpdateDocuments({ db, colId: COLLECTION, values });
      },
    []
  );

  const _batchDeleteDocuments = useCallback(async (ids: string[]) => {
    return await batchDeleteDocuments({ db, colId: COLLECTION, ids });
  }, []);

  const _getDocumentsByQuery = async <T>({
    queries,
    buildValue,
  }: {
    queries?: QueryConstraint[];
    buildValue: (value: DocumentData) => T;
  }): Promise<T[]> => {
    return await getDocumentsByQuery({
      db,
      colId: COLLECTION,
      queries,
      buildValue,
    });
  };

  const updateSentence = async (
    sentence: ArticleSentence
  ): Promise<ArticleSentence | null> => {
    return await _updateDocument(sentence);
  };

  const createSentences = async (
    sentences: Omit<ArticleSentence, 'id'>[]
  ): Promise<string[]> => {
    return await _batchAddDocuments(sentences);
  };

  const updateSentences = async (
    sentences: ArticleSentence[]
  ): Promise<boolean> => {
    return await _batchUpdateDocuments(sentences);
  };
  const deleteSentences = async (articleId: string): Promise<boolean> => {
    const sentenceIds = await _getDocumentsByQuery({
      queries: [where('article', '==', articleId)],
      buildValue: (doc: DocumentData) => doc.id as string,
    });
    return await _batchDeleteDocuments(sentenceIds);
  };
  return { updateSentence, createSentences, updateSentences, deleteSentences };
};

const buildSentence = (doc: DocumentData) => {
  const sentence: ArticleSentence = {
    id: doc.id,
    uid: doc.data().uid || '',
    end: doc.data().end || 0,
    tags: doc.data().tags || {},
    kana: doc.data().kana || '',
    line: doc.data().line || 0,
    start: doc.data().start || 0,
    title: doc.data().title || '',
    accents: doc.data().accents || [],
    article: doc.data().article || '',
    chinese: doc.data().chinese || '',
    japanese: doc.data().japanese || '',
    original: doc.data().original || '',
    createdAt: doc.data().createdAt || 0,
    kanaAccentsStr: doc.data().kanaAccentsStr || '',
    storagePath: doc.data().storagePath || '',
    storageDuration: doc.data().storageDuration || 0,
  };
  return sentence;
};

export const kanaAccentsStr2Kana = (value: string) => {
  return kana2Hira(value.replace(/[　＼]/g, ''));
};

const kana2Hira = (str: string): string => {
  return str.replace(/[\u30a1-\u30f6]/g, function (match) {
    var chr = match.charCodeAt(0) - 0x60;
    return String.fromCharCode(chr);
  });
};

const REMOVE_MARKS_REG_EXP = /[、。「」]/g;

export const kanaAccentsStr2AccentsString = (value: string) => {
  let removedMarksStr = value.replace(REMOVE_MARKS_REG_EXP, '');

  const words = removedMarksStr.split('　');
  const newWords: string[] = [];
  for (const word of words) {
    // 「＼」で分割
    const moraGroups = word.split('＼');
    const newMoraGroups: string[] = [];
    let preMoras: string[] = [];
    for (let i = 0; i < moraGroups.length; i++) {
      const moraGroup = moraGroups[i];
      const moras = getMoras(moraGroup);
      const newMoras: string[] = [];
      for (let j = 0; j < moras.length; j++) {
        const newMora = getNewMora({
          targetMora: moras[j],
          // moras の先頭は、「＼」で区切られたひとつ前のモーラと長音関係かどうかをチェックする
          // じゆ＼う　　moras = ['じゆ', 'う'] 「う」の時、「ゆ」と長音関係かどうかをチェック
          preMora: moras[j - 1] || preMoras.slice(-1)[0],
        });
        newMoras.push(newMora);
      }
      // 現在のモーラを、preMoras に代入
      preMoras = moras;
      newMoraGroups.push(newMoras.join(''));
    }
    newWords.push(newMoraGroups.join('＼'));
  }

  return newWords.join('　');
};

const getNewMora = ({
  targetMora,
  preMora,
}: {
  targetMora: string;
  preMora?: string;
}) => {
  if (!preMora) {
    return targetMora;
  }
  const isLongVowel = checkLongVowel({ targetMora, preMora });
  if (isLongVowel) {
    return 'ー';
  }
  return targetMora;
};

const checkLongVowel = ({
  targetMora,
  preMora,
}: {
  targetMora: string;
  preMora: string;
}) => {
  const preMoraVowel = mora2Vowel(preMora);
  switch (targetMora) {
    case 'あ':
    case 'ア':
      return preMoraVowel === 'a';
    case 'い':
    case 'イ':
      return ['i', 'e'].includes(preMoraVowel);
    case 'う':
    case 'ウ':
      return ['u', 'o'].includes(preMoraVowel);
    case 'え':
    case 'エ':
      return preMoraVowel === 'e';
    case 'お':
    case 'オ':
      return preMoraVowel === 'o';
    default:
      return false;
  }
};
