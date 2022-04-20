import {
  DocumentData,
  QueryConstraint,
  Unsubscribe,
  where,
  orderBy,
  limit,
} from '@firebase/firestore';

import { db } from '../repositories/firebase';
import { Accent } from '../entities/Accent';
import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  addDocument,
  deleteDocument,
  snapshotCollection,
  updateDocument,
} from '../repositories/utils';
import { ArticleSentence } from './useSentences';

export type QuestionSet = {
  id: string;
  uid: string;
  type: 'articleRhythms' | 'general' | 'articleAccents';
  title: string;
  answered: boolean;
  createdAt: number;
  unlockedAt: number;
  questionCount: number;
  hasFreeAnswers: boolean;
  questionGroups: string[];
  userDisplayname: string;
};

export const INITIAL_QUESTION_SET: QuestionSet = {
  id: '',
  uid: '',
  type: 'articleAccents',
  title: '',
  answered: false,
  createdAt: 0,
  unlockedAt: 0,
  questionCount: 0,
  hasFreeAnswers: false,
  questionGroups: [],
  userDisplayname: '',
};

const COLLECTION = 'questionSets';

export const useQuestionSets = ({
  questionSetId,
  setQuestionGroupId,
}: {
  questionSetId: string;
  setQuestionGroupId: (value: string) => void;
}) => {
  const [questionSet, setQuestionSet] =
    useState<QuestionSet>(INITIAL_QUESTION_SET);
  const [accentsQuestionSets, setAccentsQuestionSets] = useState<QuestionSet[]>(
    []
  );
  const [rhythmsQuestionSets, setRhythmsQuestionSets] = useState<QuestionSet[]>(
    []
  );
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

  const handleSetQuestionSet = useCallback((questionSet: QuestionSet) => {
    setQuestionSet(questionSet);
    setQuestionGroupId(questionSet.questionGroups[0] || '');
  }, []);

  useEffect(() => {
    if (!questionSetId) {
      handleSetQuestionSet(INITIAL_QUESTION_SET);
    } else {
      const accentsQuestionSet = accentsQuestionSets.filter(
        (questionSet) => questionSet.id === questionSetId
      )[0];
      if (!!accentsQuestionSet) {
        handleSetQuestionSet(accentsQuestionSet);
      } else {
        const rhythmsQuestionSet = rhythmsQuestionSets.filter(
          (questionSet) => questionSet.id === questionSetId
        )[0];
        if (!!rhythmsQuestionSet) {
          handleSetQuestionSet(rhythmsQuestionSet);
        } else {
          handleSetQuestionSet(INITIAL_QUESTION_SET);
        }
      }
    }
  }, [questionSetId, accentsQuestionSets, rhythmsQuestionSets]);

  useEffect(() => {
    const unsub = _snapshotCollection({
      queries: [
        where('type', '==', 'articleAccents'),
        orderBy('createdAt', 'desc'),
        limit(5),
      ],
      setValues: setAccentsQuestionSets,
      buildValue: buildQuestionSet,
    });
    return () => {
      unsub();
    };
  }, []);

  useEffect(() => {
    const unsub = _snapshotCollection({
      queries: [
        where('type', '==', 'articleRhythms'),
        orderBy('createdAt', 'desc'),
        limit(5),
      ],
      setValues: setRhythmsQuestionSets,
      buildValue: buildQuestionSet,
    });
    return () => {
      unsub();
    };
  }, []);

  return { accentsQuestionSets, rhythmsQuestionSets, questionSet };
};
export const useHandleQuestionSets = () => {
  const _addDocument = useMemo(
    () =>
      async function <T extends { id: string }>(
        value: Omit<T, 'id'>
      ): Promise<T | null> {
        return await addDocument({
          db,
          colId: COLLECTION,
          value,
        });
      },
    []
  );
  const _updateDocument = useMemo(
    () =>
      async function <T extends { id: string }>(value: T): Promise<T | null> {
        return await updateDocument({
          db,
          colId: COLLECTION,
          value,
        });
      },
    []
  );
  const _deleteDocument = useCallback(async (id: string) => {
    return await deleteDocument({ db, colId: COLLECTION, id });
  }, []);
  const createAccentsQuestionSet = async ({
    title,
    sentences,
    questionGroupId,
  }: {
    title: string;
    sentences: ArticleSentence[];
    questionGroupId: string;
  }): Promise<QuestionSet | null> => {
    let questionCount = 0;
    sentences.forEach((sentence) => {
      const accents = sentence.accents;
      questionCount += accents.length;
    });

    const { id, ...omitted } = INITIAL_QUESTION_SET;

    const questionSet: Omit<QuestionSet, 'id'> = {
      ...omitted,
      uid: import.meta.env.VITE_ADMIN_UID,
      type: 'articleAccents',
      title: `${title} - アクセント`,
      createdAt: Date.now(),
      unlockedAt: Date.now(),
      questionCount,
      questionGroups: [questionGroupId],
      userDisplayname: '原田',
    };
    return _addDocument(questionSet);
  };
  const createRhythmQuestionSet = async ({
    title,
    accentsArray,
    questionGroupId,
  }: {
    title: string;
    accentsArray: Accent[][];
    questionGroupId: string;
  }): Promise<QuestionSet | null> => {
    let questionCount = 0;
    accentsArray.forEach((accents) => {
      questionCount += accents.length;
    });
    const questionSet: Omit<QuestionSet, 'id'> = {
      uid: import.meta.env.VITE_ADMIN_UID,
      type: 'articleRhythms',
      title: `${title} - 特殊拍`,
      answered: false,
      createdAt: new Date().getTime(),
      unlockedAt: new Date().getTime(),
      questionCount,
      hasFreeAnswers: false,
      questionGroups: [questionGroupId],
      userDisplayname: '原田',
    };
    return _addDocument(questionSet);
  };

  const createQuestionSet = async (
    questionSet: Omit<QuestionSet, 'id'>
  ): Promise<QuestionSet | null> => {
    return await _addDocument(questionSet);
  };

  const updateQuestionSet = async (
    questionSet: QuestionSet
  ): Promise<QuestionSet | null> => {
    return _updateDocument(questionSet);
  };

  const deleteQuestionSet = async (id: string): Promise<boolean> => {
    return await _deleteDocument(id);
  };

  return {
    createRhythmQuestionSet,
    createAccentsQuestionSet,
    deleteQuestionSet,
    createQuestionSet,
    updateQuestionSet,
  };
};

const buildQuestionSet = (doc: DocumentData) => {
  const questionSet: QuestionSet = {
    id: doc.id,
    answered: doc.data().answered,
    createdAt: doc.data().createdAt,
    hasFreeAnswers: doc.data().hasFreeAnswers,
    questionCount: doc.data().questionCount,
    questionGroups: doc.data().questionGroups,
    title: doc.data().title,
    type: doc.data().type,
    uid: doc.data().uid,
    unlockedAt: doc.data().unlockedAt,
    userDisplayname: doc.data().userDisplayname,
  };
  return questionSet;
};
