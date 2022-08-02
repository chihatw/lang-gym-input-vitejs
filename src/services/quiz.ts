import {
  collection,
  doc,
  DocumentData,
  getDoc,
  getDocs,
  limit,
  orderBy,
  query,
  where,
} from 'firebase/firestore';
import getMoras from 'get-moras';

import {
  Accent,
  Audio,
  INITIAL_QUESTION,
  INITIAL_QUESTION_SET,
  Question,
  QuestionSet,
} from '../Model';
import { db } from '../repositories/firebase';

const COLLECTIONS = {
  questions: 'questions',
  questionSets: 'questionSets',
  questionGroups: 'questionGroups',
  questionSetScores: 'questionSetScores',
};

export const getQuiz = async (
  id: string
): Promise<{ quiz: QuestionSet; questions: Question[] }> => {
  let quiz = INITIAL_QUESTION_SET;
  console.log('get questionSet');
  let snapshot = await getDoc(doc(db, COLLECTIONS.questionSets, id));
  if (!snapshot.exists()) {
    return { quiz: INITIAL_QUESTION_SET, questions: [] };
  }
  quiz = buildQuestionSet(snapshot);

  let questions: Question[] = [];
  const { questionGroups } = quiz;
  const questionGroupId = questionGroups[0];
  console.log('get questionGroup');
  snapshot = await getDoc(doc(db, COLLECTIONS.questionGroups, questionGroupId));
  if (!snapshot.exists()) {
    return { quiz: INITIAL_QUESTION_SET, questions: [] };
  }
  const questionIds: string[] = snapshot.data().questions;
  if (!questionIds || !questionIds.length) {
    return { quiz: INITIAL_QUESTION_SET, questions: [] };
  }
  await Promise.all(
    questionIds.map(async (questionId) => {
      console.log('get question');
      snapshot = await getDoc(doc(db, COLLECTIONS.questions, questionId));
      const question = snapshot.exists()
        ? buildQuestion(snapshot)
        : INITIAL_QUESTION;
      questions.push(question);
    })
  );

  // debug quizBlob
  return { quiz, questions };
};

export const getQuizList = async () => {
  let quizList: QuestionSet[] = [];
  let q = query(
    collection(db, COLLECTIONS.questionSets),
    orderBy('createdAt', 'desc'),
    limit(10)
  );
  console.log('get questionSets');
  let querySnapshot = await getDocs(q);
  querySnapshot.forEach((doc) => {
    quizList.push(buildQuestionSet(doc));
  });
  return quizList;
};

const buildQuestionSet = (doc: DocumentData) => {
  const {
    answered,
    createdAt,
    hasFreeAnswers,
    questionCount,
    questionGroups,
    title,
    type,
    uid,
    unlockedAt,
    userDisplayname,
  } = doc.data();
  const questionSet: QuestionSet = {
    id: doc.id,
    answered: answered || false,
    createdAt: createdAt || 0,
    hasFreeAnswers: hasFreeAnswers || false,
    questionCount: questionCount || 0,
    questionGroups: questionGroups || [],
    title: title || '',
    type: type || 'articleAccents',
    uid: uid || '',
    unlockedAt: unlockedAt || 0,
    userDisplayname: userDisplayname || '',
  };
  return questionSet;
};

const buildQuestion = (doc: DocumentData) => {
  const {
    answerExample,
    answers,
    choices,
    createdAt,
    feedback,
    memo,
    note,
    question: _question,
    questionGroup,
    tags,
    type,
  } = doc.data();
  const question: Question = {
    id: doc.id,
    answerExample: answerExample || '',
    answers: answers || [],
    choices: choices || [],
    createdAt: createdAt || 0,
    feedback: feedback || '',
    memo: memo || '',
    note: note || '',
    question: _question || '',
    questionGroup: questionGroup || '',
    tags: tags || {},
    type: type || '',
  };
  return question;
};

export const buildInitialValues = (questions: Question[]) => {
  const audios: Audio[] = [];
  const japaneses: string[] = [];
  const accentStrings: string[] = [];
  const disabledsArray: number[][] = [];

  questions.forEach((question) => {
    const {
      audio,
      japanese,
      accents,
      disableds,
    }: {
      audio: Audio;
      japanese: string;
      accents: Accent[];
      disableds: number[];
    } = JSON.parse(question.question);

    audios.push(audio);
    japaneses.push(japanese);
    accentStrings.push(buildAccentString(accents));
    disabledsArray.push(disableds);
  });
  return {
    japanese: japaneses.join('\n'),
    accentString: accentStrings.join('\n'),
    disabledsArray,
    audios,
  };
};

export const buildAccentString = (accents: Accent[]) => {
  return accents
    .map((a) => {
      let result = '';
      a.moras.forEach((m, index) => {
        result += m;
        if (a.pitchPoint === index + 1) {
          result += '＼';
        }
      });
      return result;
    })
    .join('　');
};

export const buildAccents = (accentString: string): Accent[] => {
  return accentString.split('　').map((a) => {
    const moras = getMoras(a);
    const indexOfAccent = moras.indexOf('＼');
    return {
      moras: moras.filter((m) => m !== '＼'),
      pitchPoint: indexOfAccent > 0 ? indexOfAccent : 0,
    };
  });
};
