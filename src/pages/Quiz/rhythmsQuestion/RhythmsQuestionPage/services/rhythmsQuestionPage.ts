import { createContext } from 'react';

import { Rhythm } from '../../../../../entities/Rhythm';
import { Audio, User } from '../../../../../Model';

export const RhythmsQuestionPageContext = createContext<{
  uid: string;
  users: User[];
  audios: Audio[];
  isAnswered: boolean;
  rhythmString: string;
  disabledsArray: string[][][];
  sentenceRhythmArray: Rhythm[][][];
  onSubmit: () => void;
  onChangeUid: (uid: string) => void;
  onChangeTitle: (title: string) => void;
  onDeleteSentence: (sentenceIndex: number) => void;
  onChangeDisabled: (
    sentenceIndex: number,
    wordIndex: number,
    syllableIndex: number
  ) => void;
  onChangeWordDisabled: (sentenceIndex: number, wordIndex: number) => void;
  onChangeRhythmString: (rhythmString: string) => void;
  onChangeIsAnswered: (isAnswered: boolean) => void;
}>({
  uid: '',
  users: [],
  audios: [],
  isAnswered: false,
  rhythmString: '',
  disabledsArray: [],
  sentenceRhythmArray: [],
  onSubmit: () => {},
  onChangeUid: () => {},
  onChangeTitle: () => {},
  onDeleteSentence: () => {},
  onChangeDisabled: () => {},
  onChangeIsAnswered: () => {},
  onChangeRhythmString: () => {},
  onChangeWordDisabled: () => {},
});
