import { DocumentData } from '@firebase/firestore';
import { Accent } from './Accent';

export type OndokuSentence = {
  id: string;
  accents: Accent[];
  createdAt: number;
  end: number;
  japanese: string;
  line: number;
  ondoku: string;
  start: number;
};

export type CreateOndokuSentence = Omit<OndokuSentence, 'id'>;

export type UpdateOndokuSentence = Omit<
  OndokuSentence,
  'id' | 'createdAt' | 'line' | 'ondoku'
>;

export const buildOndokuSentence = (id: string, data: DocumentData) => {
  const ondokuSentence: OndokuSentence = {
    id,
    accents: data.accents,
    createdAt: data.createdAt,
    end: data.end,
    japanese: data.japanese,
    line: data.line,
    ondoku: data.ondoku,
    start: data.start,
  };
  return ondokuSentence;
};
