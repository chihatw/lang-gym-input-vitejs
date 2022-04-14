import { Unsubscribe, DocumentData } from '@firebase/firestore';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { Tags } from '../entities/Tags';
import { db } from '../repositories/firebase';
import {
  addDocument,
  updateDocument,
  deleteDocument,
  snapshotDocument,
  getDocument,
} from '../repositories/utils';

export type QuestionGroup = {
  id: string;
  tags: Tags; // will delete
  example: string;
  feedback: string;
  questions: string[];
  createdAt: number;
  explanation: string;
  hasFreeAnswers: boolean;
};

export const INITIAL_QUESTION_GROUP: QuestionGroup = {
  id: '',
  tags: {},
  example: '',
  feedback: '',
  questions: [],
  createdAt: 0,
  explanation: '',
  hasFreeAnswers: false,
};

const COLLECTION = 'questionGroups';

export const useQuestionGroups = ({
  questionGroupId,
  setQuestionIds,
}: {
  questionGroupId: string;
  setQuestionIds: (value: string[]) => void;
}) => {
  const [questionGroup, setQuestionGroup] = useState(INITIAL_QUESTION_GROUP);

  const _snapshotDocument = useMemo(
    () =>
      function <T>({
        id,
        initialValue,
        setValue,
        buildValue,
      }: {
        id: string;
        initialValue: T;
        setValue: (value: T) => void;
        buildValue: (value: DocumentData) => T;
      }): Unsubscribe {
        return snapshotDocument({
          db,
          id,
          colId: COLLECTION,
          initialValue,
          setValue,
          buildValue,
        });
      },
    []
  );

  useEffect(() => {
    setQuestionIds(questionGroup.questions);
  }, [questionGroup]);

  useEffect(() => {
    if (!questionGroupId) return;
    const unsub = _snapshotDocument({
      id: questionGroupId,
      initialValue: INITIAL_QUESTION_GROUP,
      setValue: setQuestionGroup,
      buildValue: buildQuestionGroup,
    });
    return () => {
      unsub();
    };
  }, [questionGroupId]);

  return { questionGroup };
};

export const useHandleQuestionGroups = () => {
  const _getDocument = useMemo(
    () =>
      async function <T>({
        docId,
        initialValue,
        buildValue,
      }: {
        docId: string;
        initialValue: T;
        buildValue: (value: DocumentData) => T;
      }): Promise<T> {
        return await getDocument({
          db,
          colId: COLLECTION,
          docId,
          initialValue,
          buildValue,
        });
      },
    []
  );
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

  const getQuestionGroup = async (docId: string): Promise<QuestionGroup> => {
    return await _getDocument({
      docId,
      buildValue: buildQuestionGroup,
      initialValue: INITIAL_QUESTION_GROUP,
    });
  };

  const addQuestionGroup = async (
    questionGroup: Omit<QuestionGroup, 'id'>
  ): Promise<QuestionGroup | null> => {
    return await _addDocument(questionGroup);
  };

  const createInitialQuestionGroup =
    async (): Promise<QuestionGroup | null> => {
      const questionGroup: QuestionGroup = {
        ...INITIAL_QUESTION_GROUP,
        createdAt: Date.now(),
      };
      const { id, ...omitted } = questionGroup;
      return await _addDocument(omitted);
    };
  const updateQuestionGroup = async (
    questionGroup: QuestionGroup
  ): Promise<QuestionGroup | null> => {
    return await _updateDocument(questionGroup);
  };

  const deleteQuestionGroup = async (id: string): Promise<boolean> => {
    return await _deleteDocument(id);
  };

  return {
    createInitialQuestionGroup,
    updateQuestionGroup,
    deleteQuestionGroup,
    addQuestionGroup,
    getQuestionGroup,
  };
};

const buildQuestionGroup = (doc: DocumentData) => {
  const questionGroup: QuestionGroup = {
    id: doc.id,
    createdAt: doc.data().createdAt,
    example: doc.data().example,
    explanation: doc.data().explanation,
    feedback: doc.data().feedback,
    hasFreeAnswers: doc.data().hasFreeAnswers,
    questions: doc.data().questions,
    tags: doc.data().tags,
  };
  return questionGroup;
};
