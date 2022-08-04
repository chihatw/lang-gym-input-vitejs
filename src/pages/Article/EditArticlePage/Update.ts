import * as R from 'ramda';
import { Mark } from '../../../Model';
import { ArticleVoiceState, SentenceLine } from './Model';

export const ArticleVoiceActionTypes = {
  initialize: 'initialize',
  changeMarks: 'changeMarks',
  changeBlankDuration: 'changeBlankDuration',
};
export type ArticleVoiceAction = {
  type: string;
  payload?:
    | string
    | ArticleVoiceState
    | { blankDuration: number; marks: Mark[]; sentenceLines: SentenceLine[] }
    | { marks: Mark[]; sentenceLines: SentenceLine[] };
};
export const articleVoiceReducer = (
  state: ArticleVoiceState,
  action: ArticleVoiceAction
): ArticleVoiceState => {
  const { type, payload } = action;
  const {} = state;
  switch (type) {
    case ArticleVoiceActionTypes.initialize: {
      const initialState = payload as ArticleVoiceState;
      return initialState;
    }
    case ArticleVoiceActionTypes.changeBlankDuration: {
      const { marks, blankDuration, sentenceLines } = payload as {
        marks: Mark[];
        blankDuration: number;
        sentenceLines: SentenceLine[];
      };
      return R.compose(
        R.assocPath<number, ArticleVoiceState>(
          ['blankDuration'],
          blankDuration
        ),
        R.assocPath<Mark[], ArticleVoiceState>(['marks'], marks),
        R.assocPath<SentenceLine[], ArticleVoiceState>(
          ['sentenceLines'],
          sentenceLines
        )
      )(state);
    }
    case ArticleVoiceActionTypes.changeMarks: {
      const { marks, sentenceLines } = payload as {
        marks: Mark[];
        sentenceLines: SentenceLine[];
      };
      return R.compose(
        R.assocPath<Mark[], ArticleVoiceState>(['marks'], marks),
        R.assocPath<SentenceLine[], ArticleVoiceState>(
          ['sentenceLines'],
          sentenceLines
        )
      )(state);
    }
    default:
      return R.compose(R.identity)(state);
  }
};
