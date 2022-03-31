// https://firebase.google.com/docs/firestore/manage-data/add-data#web-version-9_7
import { doc, collection, writeBatch } from '@firebase/firestore';
import { Accent } from '../entities/Accent';
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

export const useQuestions = () => {};
export const useHandleQuestions = () => {
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
    const questions = sentences2RhythmQuestion({
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
  return { createRhythmQuestions };
};

const sentences2RhythmQuestion = ({
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
    return {
      answerExample: '',
      answers: [moraString],
      choices: [],
      createdAt: new Date().getTime() + index,
      feedback: '',
      memo: '',
      note: '',
      question: JSON.stringify({
        audio: { end, start, downloadURL },
        japanese: '',
        syllableUnits: buildSentenceRhythm(moraString),
      }),
      questionGroup: questinGroupId,
      tags: {},
      type: 'articleRhythms',
    };
  });
};
