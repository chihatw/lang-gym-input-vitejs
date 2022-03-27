import firebase from 'firebase/app';

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

export const buildSentenceParseNew = (
  id: string,
  data: firebase.firestore.DocumentData
) => {
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
  hinshi: Hinshi;
  text: string;
  note?: string;
};

export type Hinshi =
  | 'meishi'
  | 'jisuushi'
  | 'doushi'
  | 'ikeiyoushi'
  | 'nakeiyoushi'
  | 'hukushi'
  | 'rentaishi'
  | 'setsuzokushi'
  | 'meishibunmatsu'
  | 'other'
  | 'sentence';

export type Branch = {
  id: string;
  lock?: boolean;
  joshi: RentaiJoshi | RenyouJoshi;
  unitID: string;
};

export type RentaiJoshi = {
  hasRentaiJoshi: boolean;
};

export type RenyouJoshi = {
  kakuJoshi: KakuJoshi | null;
  kakariJoshi: KakariJoshi | null;
};

export type KakuJoshi =
  | 'ga'
  | 'ni'
  | 'wo'
  | 'de'
  | 'to'
  | 'he'
  | 'kara'
  | 'made'
  | 'madeni'
  | 'yori'
  | 'toisshoni'
  | 'toshite'
  | 'nishite'
  | 'nitotte'
  | 'nitsuite'
  | 'nitaishite'
  | 'no';

export type KakariJoshi =
  | 'ha'
  | 'mo'
  | 'shika'
  | 'koso'
  | 'sae'
  | 'sura'
  | 'demo'
  | 'datte'
  | 'made'
  | 'dake'
  | 'bakari'
  | 'kurai'
  | 'gurai'
  | 'hodo'
  | 'nado'
  | 'nante';

export type Sentence = {
  id: string;
  topic: string;
  comments: string[];
  shuuJoshi: ShuuJoshi | null;
  juntaiJoshi: JuntaiJoshi | null;
  buntouSeibuns: string[];
  setsuzokuJoshis: { [id: string]: SetsuzokuJoshi };
  juntaiJoshiBunmatsu: string;
};

export type ShuuJoshi =
  | 'ka'
  | 'ne'
  | 'kana'
  | 'yo'
  | 'yone'
  | 'kke'
  | 'kadouka';

export type JuntaiJoshi = 'no' | 'n';

export type SetsuzokuJoshi =
  | 'ga'
  | 'kedo'
  | 'node'
  | 'noka'
  | 'kara'
  | 'karaka'
  | 'noni'
  | 'to'
  | 'nara'
  | 'shi';

export const INITIAL_SENTENCE: Sentence = {
  id: '',
  topic: '',
  comments: [],
  shuuJoshi: null,
  juntaiJoshi: null,
  buntouSeibuns: [],
  setsuzokuJoshis: {},
  juntaiJoshiBunmatsu: '',
};
