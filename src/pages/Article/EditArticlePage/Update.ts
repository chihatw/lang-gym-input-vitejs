import * as R from 'ramda';
import { Mark } from '../../../Model';
import { ArticleEditState, ArticleVoiceState, SentenceLine } from './Model';

export const articleEditReducer = (
  state: ArticleEditState,
  payload: ArticleEditState
): ArticleEditState => {
  return payload;
};

export const articleVoiceReducer = (
  state: ArticleVoiceState,
  payload: ArticleVoiceState
): ArticleVoiceState => {
  return payload;
};
