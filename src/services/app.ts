import { User as FirebaseUser } from 'firebase/auth';
import { createContext } from 'react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth } from '../repositories/firebase';
import { getMoraString, buildSentenceRhythm } from '../entities/Rhythm';
import {
  INITIAL_QUESTION_GROUP,
  QuestionGroup,
  useHandleQuestionGroups,
} from './useQuestionGroups';
import { Question, useHandleQuestions } from './useQuestions';
import {
  INITIAL_QUESTION_SET,
  QuestionSet,
  useHandleQuestionSets,
} from './useQuestionSets';

import { Accent } from '../Model';

export const AppContext = createContext<{
  user: FirebaseUser | null;
  initializing: boolean;
  accentsQuestionSets: QuestionSet[];
  rhythmsQuestionSets: QuestionSet[];
  questionSet: QuestionSet;
  questionGroup: QuestionGroup;
  questions: Question[];
  audioContext: AudioContext | null;
  setQuestionSetId: (value: string) => void;
  createRhythmsQuestion: ({
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
  initializing: true,
  accentsQuestionSets: [],
  rhythmsQuestionSets: [],
  questionSet: INITIAL_QUESTION_SET,
  questionGroup: INITIAL_QUESTION_GROUP,
  questions: [],
  setQuestionSetId: () => {},
  createRhythmsQuestion: async () => {},
  audioContext: null,
});

export const useApp = ({
  setQuestionSetId,
}: {
  setQuestionSetId: (value: string) => void;
}) => {
  const navigate = useNavigate();

  const { createQuestionSet } = useHandleQuestionSets();
  const { updateQuestionGroup, addQuestionGroup } = useHandleQuestionGroups();
  const { createQuestions } = useHandleQuestions();

  const [user, setUser] = useState(auth.currentUser);
  const [initializing, setInitializing] = useState(!auth.currentUser);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user);
      setInitializing(false);
    });
    return () => unsubscribe();
  }, []);

  const createRhythmsQuestion = async ({
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
    const questionGroup: Omit<QuestionGroup, 'id'> = {
      tags: {},
      example: '',
      feedback: '',
      questions: [],
      createdAt: new Date().getTime(),
      explanation: '',
      hasFreeAnswers: false,
    };

    const createdQuestionGroup = await addQuestionGroup(questionGroup);

    if (!!createdQuestionGroup) {
      const questions: Omit<Question, 'id'>[] = accentsArray.map((_, index) => {
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
          questionGroup: createdQuestionGroup.id,
          tags: {},
          type: 'articleRhythms',
        };
      });

      const ids = await createQuestions(questions);
      if (!!ids.length) {
        const updatedQuestionGroup: QuestionGroup = {
          ...questionGroup,
          id: createdQuestionGroup.id,
          questions: ids,
        };
        const result = await updateQuestionGroup(updatedQuestionGroup);
        if (!!result) {
          let questionCount = 0;
          accentsArray.forEach((accents) => {
            questionCount += accents.length;
          });
          const questionSet: Omit<QuestionSet, 'id'> = {
            answered: false,
            createdAt: new Date().getTime(),
            hasFreeAnswers: false,
            questionCount,
            questionGroups: [createdQuestionGroup.id],
            title: `${title} - 特殊拍`,
            type: 'articleRhythms',
            uid: import.meta.env.VITE_ADMIN_UID,
            unlockedAt: new Date().getTime(),
            userDisplayname: '原田',
          };

          const createdQuestionSet = await createQuestionSet(questionSet);
          if (!!createdQuestionSet) {
            setQuestionSetId(createdQuestionSet.id);
            navigate(`/rhythmsQuestion/${createdQuestionSet.id}`);
          }
        }
      }
    }
  };

  return { user, initializing, createRhythmsQuestion };
};
