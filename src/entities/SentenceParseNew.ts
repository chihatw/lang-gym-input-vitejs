import { DocumentData } from '@firebase/firestore';
import { SentenceParseNew } from '../services/useSentenceParseNews';

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

// export type Unit = {
//   id: string;
//   wordID: string;
//   branchIDs: string[];
// };

// export type Word = {
//   id: string;
//   text: string;
//   hinshi: string;
// };

// export type Branch = {
//   id: string;
//   lock?: boolean;
//   joshi:
//     | {
//         hasRentaiJoshi: boolean;
//       }
//     | {
//         kakuJoshi: string;
//         kakariJoshi: string;
//       };
//   unitID: string;
// };

// export type Sentence = {
//   id: string;
//   topic: string;
//   comments: string[];
//   shuuJoshi: string;
//   juntaiJoshi: string;
//   buntouSeibuns: string[];
//   setsuzokuJoshis: { [id: string]: string };
//   juntaiJoshiBunmatsu: string;
// };

// export const INITIAL_SENTENCE: Sentence = {
//   id: '',
//   topic: '',
//   comments: [],
//   shuuJoshi: '',
//   juntaiJoshi: '',
//   buntouSeibuns: [],
//   setsuzokuJoshis: {},
//   juntaiJoshiBunmatsu: '',
// };
