import { Mark, User } from '../../../Model';

export type SentenceLine = {
  xPos: number;
  color: string;
};

export type ArticleVoiceState = {
  scale: number;
  peaks: number[];
  marks: Mark[];
  labels: string[];
  hasMarks: boolean;
  duration: number;
  sampleRate: number;
  articleBlob: Blob | null;
  downloadURL: string;
  channelData: Float32Array | null;
  sentenceLines: SentenceLine[];
  blankDuration: number;
  audioContext: AudioContext | null;
};

export const INITIAL_ARTICLE_VOICE_STATE: ArticleVoiceState = {
  scale: 5,
  peaks: [],
  marks: [],
  labels: [],
  hasMarks: false,
  duration: 0,
  sampleRate: 0,
  downloadURL: '',
  channelData: null,
  articleBlob: null,
  sentenceLines: [],
  blankDuration: 0,
  audioContext: null,
};

export type ArticleEditState = {
  uid: string;
  date: Date;
  users: User[];
  title: string;
  embedId: string;
  articleMarksString: string;
};
export const INITIAL_ARTICLE_EDIT_STATE: ArticleEditState = {
  uid: '',
  date: new Date(),
  title: '',
  users: [],
  embedId: '',
  articleMarksString: '',
};
