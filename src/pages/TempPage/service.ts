import pitchesArray2String from 'pitches-array2string';
import accentsForPitchesArray from 'accents-for-pitches-array';
import {
  collection,
  doc,
  DocumentData,
  getDoc,
  getDocs,
  orderBy,
  query,
  setDoc,
  where,
} from 'firebase/firestore';

import { db } from '../../repositories/firebase';

export const TYPES = {
  articleAccents: 'articleAccents',
  articleRhythms: 'articleRhythms',
};

const COLLECTIONS = {
  quizzes: 'quizzes',
  questions: 'questions',
  questionSets: 'questionSets',
  questionGroups: 'questionGroups',
  questionSetScores: 'questionSetScores',
};

export type Syllable = {
  kana: string;
  disabled: string;
  longVowel: string;
  specialMora: string;
};

export type QuizScores = { [createdAt: number]: QuizScore };
export type QuizQuestions = { [index: number]: QuizQuestion };

export type Quiz = {
  id: string;
  uid: string;
  type: string;
  title: string;
  scores: QuizScores;
  questions: QuizQuestions;
  createdAt: number;
  downloadURL: string;
  questionCount: number;
};

export const INITIAL_QUIZ: Quiz = {
  id: '',
  uid: '',
  type: '',
  title: '',
  scores: {},
  questions: {},
  createdAt: 0,
  downloadURL: '',
  questionCount: 0,
};

export type QuizQuestion = {
  end: number;
  start: number;
  japanese: string;
  disableds: number[]; // pitchQuiz の非題化を wordIndex で指定
  pitchStr: string;
  syllables: { [index: number]: Syllable[] };
};

export type RhythmAnswer = string[][]; // string にしないと firecloud に保存できない

export type QuizScore = {
  score: number;
  createdAt: number;
  pitchAnswers: string[];
  rhythmAnswers: string[];
};

export const INITIAL_QUIZ_SCORE: QuizScore = {
  score: 0,
  createdAt: 0,
  pitchAnswers: [],
  rhythmAnswers: [],
};

export const INITIAL_QUIZ_QUESTION: QuizQuestion = {
  end: 0,
  start: 0,
  pitchStr: '',
  japanese: '',
  disableds: [],
  syllables: {},
};

export const getQuiz = async (questionSetId: string) => {
  let snapshot = await getDoc(doc(db, COLLECTIONS.questionSets, questionSetId));
  const { quiz, questionGroupId } = buildQuiz(snapshot);

  snapshot = await getDoc(doc(db, COLLECTIONS.questionGroups, questionGroupId));
  if (!snapshot.exists()) return;
  const questionIds: string[] = snapshot.data().questions;
  const { questions, downloadURL } = await buildQuizQuestions(
    quiz.type,
    questionIds
  );
  quiz.questions = questions;
  quiz.downloadURL = downloadURL;

  let q = query(
    collection(db, COLLECTIONS.questionSetScores),
    where('questionSet', '==', quiz.id),
    orderBy('createdAt')
  );
  let querySnapshot = await getDocs(q);
  let quizScores: QuizScores = {};

  querySnapshot.forEach((doc) => {
    const quizScore = buildQuizScore(doc, quiz.type, questionIds);
    quizScores[quizScore.createdAt] = quizScore;
  });

  quiz.scores = quizScores;

  const { id, ...omitted } = quiz;

  setDoc(doc(db, COLLECTIONS.quizzes, id), { ...omitted });
};

const buildQuizScore = (
  doc: DocumentData,
  type: string,
  questionIds: string[]
) => {
  switch (type) {
    case TYPES.articleAccents:
      return buildPitchQuizScore(doc, questionIds);
    case TYPES.articleRhythms:
      return buildRhythmQuizScore(doc, questionIds);
    default:
      return INITIAL_QUIZ_SCORE;
  }
};

const buildQuizQuestions = async (type: string, questionIds: string[]) => {
  const questions: QuizQuestions = {};
  let downloadURL = '';
  await Promise.all(
    questionIds.map(async (questionId, index) => {
      console.log('get question');
      const snapshot = await getDoc(doc(db, COLLECTIONS.questions, questionId));
      if (snapshot.exists()) {
        const { question, downloadURL: _downloadURL } = buildQuizQuestion(
          type,
          snapshot
        );
        questions[index] = question;
        downloadURL = _downloadURL;
      }
    })
  );
  return { questions, downloadURL };
};

const buildQuizQuestion = (
  type: string,
  snapshot: DocumentData
): { question: QuizQuestion; downloadURL: string } => {
  let question = INITIAL_QUIZ_QUESTION;
  let downloadURL = '';
  switch (type) {
    case TYPES.articleAccents:
      const { quizQuestion: articleQuestion, downloadURL: articleDownloadURL } =
        buildPitchQuizQuestion(snapshot);
      question = articleQuestion;
      downloadURL = articleDownloadURL;
      break;
    case TYPES.articleRhythms:
      const { quizQuestion: rhythmQuestion, downloadURL: rhythmDownloadURL } =
        buildRhythmQuizQuestion(snapshot);
      question = rhythmQuestion;
      downloadURL = rhythmDownloadURL;
    default:
  }
  return { question, downloadURL };
};

const buildQuiz = (
  doc: DocumentData
): { quiz: Quiz; questionGroupId: string } => {
  const { uid, type, title, createdAt, questionCount, questionGroups } =
    doc.data();
  const quiz: Quiz = {
    id: doc.id,
    uid: uid || '',
    type: type || '',
    title: title || '',
    scores: {},
    questions: [],
    createdAt: createdAt || 0,
    downloadURL: '',
    questionCount: questionCount || 0,
  };
  return { quiz, questionGroupId: questionGroups[0] || '' };
};

const buildPitchQuizQuestion = (
  doc: DocumentData
): {
  quizQuestion: QuizQuestion;
  downloadURL: string;
} => {
  const { question } = doc.data();
  const {
    audio,
    accents,
    japanese,
    disableds,
  }: {
    japanese: string;
    audio: { start: number; end: number; downloadURL: string };
    disableds: number[];
    accents: { moras: string[]; pitchPoint: number }[];
  } = JSON.parse(question);

  const { end, start, downloadURL } = audio;
  const pitchesArray = accentsForPitchesArray(accents);
  const pitchStr = pitchesArray2String(pitchesArray);
  const quizQuestion: QuizQuestion = {
    end,
    start,
    pitchStr,
    japanese,
    disableds,
    syllables: {},
  };
  return { quizQuestion, downloadURL };
};

const buildRhythmQuizQuestion = (
  doc: DocumentData
): { quizQuestion: QuizQuestion; downloadURL: string } => {
  const { question } = doc.data();
  const {
    audio,
    syllableUnits,
  }: {
    audio: { start: number; end: number; downloadURL: string };
    syllableUnits: {
      syllable: string;
      index: number;
      mora: string;
      disabled: string;
      longVowel: string;
    }[][];
  } = JSON.parse(question);
  const { end, start, downloadURL } = audio;

  const syllables: { [index: number]: Syllable[] } = {};

  syllableUnits.forEach((item, index) => {
    syllables[index] = item.map((item) => ({
      kana: item.syllable || '',
      disabled: item.disabled || '',
      longVowel: item.longVowel || '',
      specialMora: item.mora || '',
    }));
  });

  const quizQuestion: QuizQuestion = {
    end,
    start,
    pitchStr: '',
    japanese: '',
    disableds: [],
    syllables,
  };
  return { quizQuestion, downloadURL };
};

const buildPitchQuizScore = (
  doc: DocumentData,
  questionIds: string[]
): QuizScore => {
  const {
    score,
    answers,
    createdAt,
  }: {
    score: number;
    answers: { [questionId: string]: string };
    createdAt: number;
  } = doc.data();
  const parsedAnswers: { [questionId: string]: string } = {};
  for (const [questionId, answer] of Object.entries(answers)) {
    const accents: { moras: string[]; pitchPoint: number }[] =
      JSON.parse(answer);
    const pitchesArray = accentsForPitchesArray(accents);
    const pitchStr = pitchesArray2String(pitchesArray);
    parsedAnswers[questionId] = pitchStr;
  }
  return {
    score,
    createdAt,
    pitchAnswers: questionIds.map((questionId) => parsedAnswers[questionId]),
    rhythmAnswers: [],
  };
};

const buildRhythmQuizScore = (
  doc: DocumentData,
  questionIds: string[]
): QuizScore => {
  const {
    score,
    answers,
    createdAt,
  }: {
    score: number;
    answers: { [questionId: string]: string };
    createdAt: number;
  } = doc.data();
  const parsedAnswers: { [questionId: string]: string } = {};
  for (const [questionId, answer] of Object.entries(answers)) {
    const parsed: string[][] = JSON.parse(answer);
    const rhythemAnswerStr = rhythmAnswerToString(parsed);
    parsedAnswers[questionId] = rhythemAnswerStr;
  }
  return {
    score,
    createdAt,
    pitchAnswers: [],
    rhythmAnswers: questionIds.map((questionId) => parsedAnswers[questionId]),
  };
};

const rhythmAnswerToString = (rhythmAnswer: string[][]): string => {
  const wordSpecialMorasArray: string[] = [];
  for (const wordSpecialMoras of rhythmAnswer) {
    wordSpecialMorasArray.push(wordSpecialMoras.join(','));
  }
  return wordSpecialMorasArray.join('\n');
};
