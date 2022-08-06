import * as R from 'ramda';
import { Mark } from '../../../Model';
import { ArticleEditState, ArticleVoiceState, SentenceLine } from './Model';

export const ArticleEditActionTypes = {
  changeUid: 'changeUid',
  changeDate: 'changeDate',
  initialize: 'initialize',
  changeTitle: 'changeTitle',
  changeEmbedId: 'changeEmbedId',
  changeMarksString: 'changeMarksString',
};
export type ArticleEditAction = {
  type: string;
  payload?: string | ArticleEditState | Date;
};
export const articleEditReducer = (
  state: ArticleEditState,
  action: ArticleEditAction
): ArticleEditState => {
  const { type, payload } = action;
  switch (type) {
    case ArticleEditActionTypes.initialize: {
      const initialState = payload as ArticleEditState;
      return initialState;
    }
    case ArticleEditActionTypes.changeUid: {
      const uid = payload as string;
      return R.compose(R.assocPath<string, ArticleEditState>(['uid'], uid))(
        state
      );
    }
    case ArticleEditActionTypes.changeDate: {
      const date = payload as Date;
      return R.compose(R.assocPath<Date, ArticleEditState>(['date'], date))(
        state
      );
    }
    case ArticleEditActionTypes.changeTitle: {
      const title = payload as string;
      return R.compose(R.assocPath<string, ArticleEditState>(['title'], title))(
        state
      );
    }
    case ArticleEditActionTypes.changeEmbedId: {
      const embedId = payload as string;
      return R.compose(
        R.assocPath<string, ArticleEditState>(['embedId'], embedId)
      )(state);
    }
    case ArticleEditActionTypes.changeMarksString: {
      const articleMarksString = payload as string;
      return R.compose(
        R.assocPath<string, ArticleEditState>(
          ['articleMarksString'],
          articleMarksString
        )
      )(state);
    }
    default:
      return R.compose(R.identity)(state);
  }
};

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
