// https://firebase.google.com/docs/firestore/manage-data/add-data#web-version-9_7
import { doc, collection, writeBatch } from '@firebase/firestore';
import { Accent, buildAccentString } from '../entities/Accent';
import { buildSentenceRhythm, getMoraString } from '../entities/Rhythm';

import { Tags } from '../entities/Tags';
import { db } from '../repositories/firebase';

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
const colRef = collection(db, COLLECTION);

export const useQuestions = () => {
  // ...
};
export const useHandleQuestions = () => {
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
    const docIds: string[] = [];
    const batch = writeBatch(db);
    questions.forEach((question) => {
      const docRef = doc(colRef);
      docIds.push(docRef.id);
      batch.set(docRef, question);
    });
    console.log('create accents questions');
    return await batch
      .commit()
      .then(() => {
        return docIds;
      })
      .catch((e) => {
        console.warn(e);
        return [];
      });
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
    const docIds: string[] = [];
    const batch = writeBatch(db);
    questions.forEach((question) => {
      const newDocRef = doc(colRef);
      docIds.push(newDocRef.id);
      batch.set(newDocRef, question);
    });
    return await batch
      .commit()
      .then(() => {
        return docIds;
      })
      .catch((e) => {
        console.warn(e);
        return [];
      });
  };
  return { createRhythmQuestions, createAccentsQuestions };
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
