import { User as _User } from 'firebase/auth';

import { createContext } from 'react';
import { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { Accent } from '../entities/Accent';
import { CreateQuestion } from '../entities/Question';
import { CreateQuestionGroup, QuestionGroup } from '../entities/QuestionGroup';
import { CreateQuestionSet } from '../entities/QuestionSet';
import { getMoraString, buildSentenceRhythm } from '../entities/Rhythm';
import { auth } from '../repositories/firebase';
import { createQuestions } from '../repositories/question';
import {
  createQuestionGroup,
  updateQuestionGroup,
} from '../repositories/questionGroup';
import { createQuestionSet } from '../repositories/questionSet';
import { AudioItem } from './useAudioItems';

export const AppContext = createContext<{
  user: _User | null;
  audioItems: AudioItem[];
  initializing: boolean;
  deleteAudioItem: (value: string) => void;
  onCreateRhythmsQuestion: ({
    title,
    endArray,
    startArray,
    downloadURL,
    accentsArray,
  }: {
    title: string;
    endArray: number[];
    startArray: number[];
    downloadURL: string;
    accentsArray: Accent[][];
  }) => Promise<void>;
}>({
  user: null,
  audioItems: [],
  initializing: true,
  deleteAudioItem: () => {},
  onCreateRhythmsQuestion: async () => {},
});

export const useApp = () => {
  const history = useHistory();
  const [user, setUser] = useState(auth.currentUser);
  const [initializing, setInitializing] = useState(!auth.currentUser);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user);
      setInitializing(false);
    });
    return () => unsubscribe();
  }, []);

  const onCreateRhythmsQuestion = async ({
    title,
    endArray,
    startArray,
    downloadURL,
    accentsArray,
  }: {
    title: string;
    endArray: number[];
    startArray: number[];
    downloadURL: string;
    accentsArray: Accent[][];
  }) => {
    const questionGroup: CreateQuestionGroup = {
      tags: {},
      example: '',
      feedback: '',
      questions: [],
      createdAt: new Date().getTime(),
      explanation: '',
      hasFreeAnswers: false,
    };

    const { success, questionGroupID } = await createQuestionGroup(
      questionGroup
    );

    if (success) {
      const questions: CreateQuestion[] = accentsArray.map((_, index) => {
        const moraString = getMoraString(accentsArray[index]);
        return {
          answerExample: '',
          answers: [moraString],
          choices: [],
          createdAt: new Date().getTime() + index,
          feedback: '',
          memo: '',
          note: '',
          question: JSON.stringify({
            audio: {
              start: startArray[index],
              end: endArray[index],
              downloadURL,
            },
            japanese: '',
            syllableUnits: buildSentenceRhythm(moraString),
          }),
          questionGroup: questionGroupID!,
          tags: {},
          type: 'articleRhythms',
        };
      });

      const docIDs = await createQuestions(questions);
      if (!!docIDs.length) {
        const updatedQuestionGroup: QuestionGroup = {
          ...questionGroup,
          id: questionGroupID!,
          questions: docIDs,
        };
        const { success } = await updateQuestionGroup(updatedQuestionGroup);
        if (success) {
          let questionCount = 0;
          accentsArray.forEach((accents) => {
            questionCount += accents.length;
          });
          const questionSet: CreateQuestionSet = {
            answered: false,
            createdAt: new Date().getTime(),
            hasFreeAnswers: false,
            questionCount,
            questionGroups: [questionGroupID!],
            title: `${title} - 特殊拍`,
            type: 'articleRhythms',
            uid: import.meta.env.VITE_ADMIN_UID,
            unlockedAt: new Date().getTime(),
            userDisplayname: '原田',
          };

          const { success, questionSetID } = await createQuestionSet(
            questionSet
          );
          if (success) {
            history.push(`/rhythmsQuestion/${questionSetID!}`);
          }
        }
      }
    }
  };

  return { user, initializing, onCreateRhythmsQuestion };
};
