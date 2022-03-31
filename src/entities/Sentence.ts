import { DocumentData } from '@firebase/firestore';

import { Accent } from './Accent';
import { Tags } from './Tags';

export type Sentence = {
  id: string;
  accents: Accent[];
  article: string;
  chinese: string;
  createdAt: number;
  end: number;
  japanese: string;
  kana: string;
  line: number;
  original: string;
  start: number;
  tags: Tags;
  title: string;
  uid: string;
};

export type CreateSentence = Omit<Sentence, 'id'>;

export const buildSentence = (id: string, data: DocumentData) => {
  const sentence: Sentence = {
    id,
    accents: data.accents,
    article: data.article,
    chinese: data.chinese,
    createdAt: data.createdAt,
    end: data.end,
    japanese: data.japanese,
    kana: data.kana,
    line: data.line,
    original: data.original,
    start: data.start,
    tags: data.tags,
    title: data.title,
    uid: data.uid,
  };
  return sentence;
};
