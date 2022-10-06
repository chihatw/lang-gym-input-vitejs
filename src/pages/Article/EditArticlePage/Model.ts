import {
  User,
  Article,
  ArticleSentence,
  INITIAL_ARTICLE,
} from '../../../Model';

export type SentenceLine = {
  xPos: number;
  color: string;
};

export type ArticleVoiceState = {
  peaks: number[];
  scale: number;
  duration: number;
  channelData: Float32Array | null;
  blankDuration: number;
};

export const INITIAL_ARTICLE_VOICE_STATE: ArticleVoiceState = {
  scale: 5,
  peaks: [],
  duration: 0,
  channelData: null,
  blankDuration: 0,
};

export type ArticleEditState = {
  blob: Blob | null;
  users: User[];
  article: Article;
  sentences: ArticleSentence[];
  audioContext: AudioContext | null;
  wave: {
    peaks: number[];
    scale: number;
    duration: number;
    channelData: Float32Array | null;
    blankDuration: number;
  };
};
export const INITIAL_ARTICLE_EDIT_STATE: ArticleEditState = {
  blob: null,
  users: [],
  article: INITIAL_ARTICLE,
  sentences: [],
  audioContext: null,
  wave: INITIAL_ARTICLE_VOICE_STATE,
};
