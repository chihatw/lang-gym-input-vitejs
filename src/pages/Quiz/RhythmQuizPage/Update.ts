import * as R from 'ramda';

import { Audio, Rhythm } from '../../../Model';
import { RhythmQuizState } from './Model';

export const RhythmQuizActionTypes = {
  changeUid: 'changeUid',
  changeEnd: 'changeEnd',
  deleteLine: 'deleteLine',
  initialize: 'initialize',
  changeTitle: 'changeTitle',
  changeStart: 'changeStart',
  changeDisabled: 'changeDisabled',
  changeAnswered: 'changeAnswered',
  changeRhythmString: 'changeRhythmString',
};

export type RhythmQuizAction = {
  type: string;
  payload?:
    | string
    | boolean
    | RhythmQuizState
    | { index: number; value: number }
    | {
        rhythmString: string;
        rhythmArray: Rhythm[][][];
        disabledsArray: string[][][];
      }
    | {
        rhythmString: string;
        rhythmArray: Rhythm[][][];
        disabledsArray: string[][][];
        audios: Audio[];
      }
    | {
        sentenceIndex: number;
        wordIndex: number;
        syllableIndex: number;
        specialMora: string;
      };
};

export const rhythmQuizReducer = (
  state: RhythmQuizState,
  action: RhythmQuizAction
) => {
  const { type, payload } = action;
  switch (type) {
    case RhythmQuizActionTypes.initialize: {
      const rhythmQuizState = payload as RhythmQuizState;
      return rhythmQuizState;
    }
    case RhythmQuizActionTypes.changeTitle: {
      const title = payload as string;
      return R.compose(R.assocPath<string, RhythmQuizState>(['title'], title))(
        state
      );
    }
    case RhythmQuizActionTypes.changeUid: {
      const uid = payload as string;
      return R.compose(R.assocPath<string, RhythmQuizState>(['uid'], uid))(
        state
      );
    }
    case RhythmQuizActionTypes.changeAnswered: {
      const answered = payload as boolean;
      return R.compose(
        R.assocPath<boolean, RhythmQuizState>(['answered'], answered)
      )(state);
    }
    case RhythmQuizActionTypes.changeStart: {
      const { index, value } = payload as { index: number; value: number };
      return R.compose(
        R.assocPath<number, RhythmQuizState>(['audios', index, 'start'], value)
      )(state);
    }
    case RhythmQuizActionTypes.changeEnd: {
      const { index, value } = payload as { index: number; value: number };
      return R.compose(
        R.assocPath<number, RhythmQuizState>(['audios', index, 'end'], value)
      )(state);
    }
    case RhythmQuizActionTypes.changeDisabled: {
      const { sentenceIndex, wordIndex, syllableIndex, specialMora } =
        payload as {
          sentenceIndex: number;
          wordIndex: number;
          syllableIndex: number;
          specialMora: string;
        };
      return R.compose(
        R.assocPath<string, RhythmQuizState>(
          ['disabledsArray', sentenceIndex, wordIndex, syllableIndex],
          specialMora
        )
      )(state);
    }
    case RhythmQuizActionTypes.changeRhythmString: {
      const { rhythmArray, rhythmString, disabledsArray } = payload as {
        rhythmArray: Rhythm[][][];
        rhythmString: string;
        disabledsArray: string[][][];
      };
      return R.compose(
        R.assocPath<Rhythm[][][], RhythmQuizState>(
          ['rhythmArray'],
          rhythmArray
        ),
        R.assocPath<string, RhythmQuizState>(['rhythmString'], rhythmString),
        R.assocPath<string[][][], RhythmQuizState>(
          ['disabledsArray'],
          disabledsArray
        )
      )(state);
    }
    case RhythmQuizActionTypes.deleteLine: {
      const { audios, rhythmArray, rhythmString, disabledsArray } = payload as {
        audios: Audio[];
        rhythmArray: Rhythm[][][];
        rhythmString: string;
        disabledsArray: string[][][];
      };
      return R.compose(
        R.assocPath<Audio[], RhythmQuizState>(['audios'], audios),
        R.assocPath<Rhythm[][][], RhythmQuizState>(
          ['rhythmArray'],
          rhythmArray
        ),
        R.assocPath<string, RhythmQuizState>(['rhythmString'], rhythmString),
        R.assocPath<string[][][], RhythmQuizState>(
          ['disabledsArray'],
          disabledsArray
        )
      )(state);
    }
    default:
      return R.compose(R.identity)(state);
  }
};
