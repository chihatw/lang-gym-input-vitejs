// https://firebase.google.com/docs/firestore/manage-data/add-data#web-version-9_7
import { Unsubscribe } from 'firebase/auth';
import { DocumentData, QueryConstraint, where } from 'firebase/firestore';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { Accent, buildAccentString } from '../entities/Accent';
import { buildSentenceRhythm, getMoraString } from '../entities/Rhythm';

import { Tags } from '../entities/Tags';
import { db } from '../repositories/firebase';
import {
  batchAddDocuments,
  batchDeleteDocuments,
  batchUpdateDocuments,
  snapshotCollection,
} from '../repositories/utils';

export const INITIAL_QUESTION = {
  id: '',
  tags: {},
  memo: '',
  note: '',
  type: 'describe',
  answers: [''],
  choices: [],
  feedback: '',
  question: '',
  createdAt: 0,
  answerExample: '',
  questionGroup: '',
};

export type Question = {
  id: string;
  answerExample: string;
  answers: string[];
  choices: string[];
  createdAt: number;
  feedback: string;
  memo: string;
  note: string;
  question: string;
  questionGroup: string;
  tags: Tags;
  type: string;
};

const COLLECTION = 'questions';

export const useQuestions = ({
  questionIds,
  questionGroupId,
}: {
  questionIds: string[];
  questionGroupId: string;
}) => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [unSortedQuestions, setUnSortedQuestions] = useState<Question[]>([]);

  useEffect(() => {
    const questions: Question[] = questionIds
      .map((questionId) => {
        return unSortedQuestions.filter(
          (question) => question.id === questionId
        )[0];
      })
      .filter((i) => i);
    setQuestions(questions);
  }, [unSortedQuestions, questionIds]);

  const _snapshotCollection = useMemo(
    () =>
      function <T>({
        queries,
        setValues,
        buildValue,
      }: {
        queries?: QueryConstraint[];
        setValues: (value: T[]) => void;
        buildValue: (value: DocumentData) => T;
      }): Unsubscribe {
        return snapshotCollection({
          db,
          colId: COLLECTION,
          queries,
          setValues,
          buildValue,
        });
      },
    []
  );

  useEffect(() => {
    const unsub = _snapshotCollection({
      queries: [where('questionGroup', '==', questionGroupId)],
      buildValue: buildQuestion,
      setValues: setUnSortedQuestions,
    });
    return () => {
      unsub();
    };
  }, [questionGroupId]);

  return { questions };
};
export const useHandleQuestions = () => {
  const _batchAddDocuments = useMemo(
    () =>
      async function <T extends { id: string }>(
        values: Omit<T, 'id'>[]
      ): Promise<string[]> {
        return await batchAddDocuments({ db, colId: COLLECTION, values });
      },
    []
  );
  const _batchUpdateDocuments = useMemo(
    () =>
      async function <T extends { id: string }>(values: T[]): Promise<boolean> {
        return await batchUpdateDocuments({ db, colId: COLLECTION, values });
      },
    []
  );

  const _batchDeleteDocuments = useCallback(async (ids: string[]) => {
    return await batchDeleteDocuments({ db, colId: COLLECTION, ids });
  }, []);

  const createAccentsQuestions = async ({
    sentences,
    questionGroupId,
  }: {
    sentences: {
      japanese: string;
      accents: Accent[];
    }[];
    questionGroupId: string;
  }): Promise<string[]> => {
    const questions = sentences2AccentsQuestions({
      sentences,
      questionGroupId,
    });

    return await _batchAddDocuments(questions);
  };
  const createRhythmQuestions = async ({
    sentences,
    downloadURL,
    questinGroupId,
  }: {
    sentences: {
      end: number;
      start: number;
      accents: Accent[];
    }[];
    downloadURL: string;
    questinGroupId: string;
  }): Promise<string[]> => {
    const questions = sentences2RhythmQuestions({
      sentences,
      downloadURL,
      questinGroupId,
    });
    return await _batchAddDocuments(questions);
  };

  const createQuestions = async (
    questions: Omit<Question, 'id'>[]
  ): Promise<string[]> => {
    return await _batchAddDocuments(questions);
  };

  const updateQuestions = async (questions: Question[]): Promise<boolean> => {
    return await _batchUpdateDocuments(questions);
  };

  const deleteQuestions = async (ids: string[]): Promise<boolean> => {
    return await _batchDeleteDocuments(ids);
  };

  return {
    createRhythmQuestions,
    createAccentsQuestions,
    deleteQuestions,
    updateQuestions,
    createQuestions,
  };
};

const sentences2RhythmQuestions = ({
  sentences,
  downloadURL,
  questinGroupId,
}: {
  sentences: {
    end: number;
    start: number;
    accents: Accent[];
  }[];
  downloadURL: string;
  questinGroupId: string;
}): Omit<Question, 'id'>[] => {
  return sentences.map(({ accents, end, start }, index) => {
    const moraString = getMoraString(accents);
    const { id, ...omitted } = INITIAL_QUESTION;
    return {
      ...omitted,
      answers: [moraString],
      createdAt: new Date().getTime() + index,
      question: JSON.stringify({
        audio: { end, start, downloadURL },
        japanese: '',
        syllableUnits: buildSentenceRhythm(moraString),
      }),
      questionGroup: questinGroupId,
      type: 'articleRhythms',
    };
  });
};

const sentences2AccentsQuestions = ({
  sentences,
  questionGroupId,
}: {
  sentences: {
    japanese: string;
    accents: Accent[];
  }[];
  questionGroupId: string;
}): Omit<Question, 'id'>[] => {
  return sentences.map(({ japanese, accents }, index) => {
    const { id, ...omitted } = INITIAL_QUESTION;
    const question: Omit<Question, 'id'> = {
      ...omitted,
      answers: [buildAccentString(accents)],
      createdAt: new Date().getTime() + index,
      question: JSON.stringify({
        japanese,
        disableds: [],
        audio: { start: 0, end: 0, downloadURL: '' },
        accents,
      }),
      questionGroup: questionGroupId,
      type: 'articleAccents',
    };
    return question;
  });
};

const buildQuestion = (doc: DocumentData) => {
  const question: Question = {
    id: doc.id,
    answerExample: doc.data().answerExample,
    answers: doc.data().answers,
    choices: doc.data().choices,
    createdAt: doc.data().createdAt,
    feedback: doc.data().feedback,
    memo: doc.data().memo,
    note: doc.data().note,
    question: doc.data().question,
    questionGroup: doc.data().questionGroup,
    tags: doc.data().tags,
    type: doc.data().type,
  };
  return question;
};
