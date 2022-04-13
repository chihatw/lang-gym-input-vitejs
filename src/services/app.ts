import { User as _User } from 'firebase/auth';
import { createContext } from 'react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { auth } from '../repositories/firebase';
import { Accent } from '../entities/Accent';
import { AudioItem } from './useAudioItems';
import { CreateQuestion } from '../entities/Question';
import { createQuestions } from '../repositories/question';
import { createQuestionSet } from '../repositories/questionSet';
import { CreateQuestionSet } from '../entities/QuestionSet';
import { CreateQuestionGroup, QuestionGroup } from '../entities/QuestionGroup';
import { getMoraString, buildSentenceRhythm } from '../entities/Rhythm';
import {
  createQuestionGroup,
  updateQuestionGroup,
} from '../repositories/questionGroup';
import { Article, INITIAL_ARTICLE } from './useArticles';
import { User } from './useUsers';
import { Sentence } from './useSentences';
import { Assignment, INITIAL_ASSIGNMENT } from './useAssignments';
import { AssignmentSentence } from './useAssignmentSentences';
import { SentenceParseNew } from './useSentenceParseNews';
import { INITIAL_WORKOUT, Workout } from './useWorkouts';
import { INITIAL_ONDOKU, Ondoku } from './useOndokus';

export const AppContext = createContext<{
  user: _User | null;
  users: User[];
  article: Article;
  ondoku: Ondoku;
  ondokus: Ondoku[];
  workout: Workout;
  articles: Article[];
  workouts: Workout[];
  sentences: Sentence[];
  audioItems: AudioItem[];
  isFetching: boolean;
  assignment: Assignment;
  initializing: boolean;
  sentenceParseNews: SentenceParseNew[];
  assignmentSentences: AssignmentSentence[];
  setOndokuId: (value: string) => void;
  setArticleId: (value: string) => void;
  setWorkoutId: (value: string) => void;
  setIsFetching: (value: boolean) => void;
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
  users: [],
  article: INITIAL_ARTICLE,
  workout: INITIAL_WORKOUT,
  workouts: [],
  ondoku: INITIAL_ONDOKU,
  ondokus: [],
  articles: [],
  sentences: [],
  audioItems: [],
  isFetching: false,
  assignment: INITIAL_ASSIGNMENT,
  initializing: true,
  sentenceParseNews: [],
  assignmentSentences: [],
  setOndokuId: () => {},
  setArticleId: () => {},
  setWorkoutId: () => {},
  setIsFetching: () => {},
  createRhythmsQuestion: async () => {},
});

export const useApp = () => {
  const navigate = useNavigate();
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
            navigate(`/rhythmsQuestion/${questionSetID!}`);
          }
        }
      }
    }
  };

  return { user, initializing, createRhythmsQuestion };
};
