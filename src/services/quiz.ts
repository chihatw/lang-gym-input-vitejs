import { nanoid } from 'nanoid';
import KANA_ROMAJI_MAP from 'kana-romaji-map';
import {
  collection,
  deleteDoc,
  doc,
  DocumentData,
  getDoc,
  getDocs,
  limit,
  orderBy,
  query,
  setDoc,
  updateDoc,
} from 'firebase/firestore';
import getMoras from 'get-moras';

import {
  Accent,
  Audio,
  INITIAL_QUESTION,
  INITIAL_QUESTION_GROUP,
  INITIAL_QUESTION_SET,
  Question,
  QuestionGroup,
  QuestionSet,
  Rhythm,
  SpecialMora,
  State,
  User,
} from '../Model';
import { db, storage } from '../repositories/firebase';

import { RhythmQuizState } from '../pages/Quiz/RhythmQuizPage/Model';
import { getDownloadURL, ref } from 'firebase/storage';
import {
  INITIAL_QUIZ,
  Quiz,
  QuizQuestion,
  QuizQuestions,
} from '../pages/TempPage/service';
import { AccentQuizFormState } from '../pages/Quiz/AccentQuizPage/Model';

const SPACE = '　';

const COLLECTIONS = {
  quizzes: 'quizzes',
  questions: 'questions',
  questionSets: 'questionSets',
  questionGroups: 'questionGroups',
};

export const getQuiz = async (
  id: string
): Promise<{
  quiz: QuestionSet;
  newQuiz: Quiz;
  questions: Question[];
  quizBlob: Blob | null;
}> => {
  let quiz = INITIAL_QUESTION_SET;
  console.log('get questionSet');
  let snapshot = await getDoc(doc(db, COLLECTIONS.questionSets, id));

  if (!snapshot.exists()) {
    return {
      quiz: INITIAL_QUESTION_SET,
      questions: [],
      quizBlob: null,
      newQuiz: INITIAL_QUIZ,
    };
  }
  quiz = buildQuestionSet(snapshot);

  let questions: Question[] = [];
  const { questionGroups } = quiz;
  const questionGroupId = questionGroups[0];
  console.log('get questionGroup');
  snapshot = await getDoc(doc(db, COLLECTIONS.questionGroups, questionGroupId));
  if (!snapshot.exists()) {
    return {
      quiz: INITIAL_QUESTION_SET,
      questions: [],
      quizBlob: null,
      newQuiz: INITIAL_QUIZ,
    };
  }
  const questionIds: string[] = snapshot.data().questions;
  if (!questionIds || !questionIds.length) {
    return {
      quiz: INITIAL_QUESTION_SET,
      questions: [],
      quizBlob: null,
      newQuiz: INITIAL_QUIZ,
    };
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

  let quizBlob = null;
  if (questions.length) {
    const question = questions[0];
    const { audio }: { audio: Audio } = JSON.parse(question.question);
    if (audio) {
      let { downloadURL } = audio;
      if (downloadURL) {
        const header = downloadURL.slice(0, 4);
        if (header !== 'http') {
          downloadURL = await getDownloadURL(ref(storage, downloadURL));
        }
        console.log('create quiz blob');
        const response = await fetch(downloadURL);
        quizBlob = await response.blob();
      }
    }
  }

  snapshot = await getDoc(doc(db, COLLECTIONS.quizzes, id));
  if (!snapshot.exists()) {
    return { quiz, questions, quizBlob, newQuiz: INITIAL_QUIZ };
  }
  const newQuiz = buildQuiz(snapshot);
  console.log({ newQuiz });
  return { quiz, questions, quizBlob, newQuiz };
};

export const getQuizList = async (): Promise<Quiz[]> => {
  let quizzes: Quiz[] = [];
  let q = query(
    collection(db, COLLECTIONS.quizzes),
    orderBy('createdAt', 'desc'),
    limit(10)
  );
  let querySnapshot = await getDocs(q);
  querySnapshot.forEach((doc) => {
    quizzes.push(buildQuiz(doc));
  });
  return quizzes;
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

export const buildAccentQuizFormState = (
  quiz: Quiz,
  users: User[]
): AccentQuizFormState => {
  const { uid, title, questions, scores, downloadURL, questionCount } = quiz;

  const japaneseArray: string[] = [];
  const pitchStrArray: string[] = [];
  const disabledsArray: number[][] = [];
  const starts: number[] = [];
  const ends: number[] = [];
  Object.values(questions).forEach((question) => {
    const { japanese, pitchStr, disableds, start, end } = question;

    japaneseArray.push(japanese);
    pitchStrArray.push(pitchStr);
    disabledsArray.push(disableds);
    starts.push(start);
    ends.push(end);
  });

  return {
    users,
    uid,
    title,
    scores,
    japanese: japaneseArray.join('\n'),
    pitchStr: pitchStrArray.join('\n'),
    disabledsArray,
    downloadURL,
    starts,
    ends,
    questionCount,
  };
};

export const buildAccentInitialValues = (questions: QuizQuestions) => {
  const japaneses: string[] = [];
  const accentStrings: string[] = [];
  const disabledsArray: number[][] = [];

  Object.values(questions).forEach((question) => {
    const { japanese, pitchStr, disableds } = question;

    japaneses.push(japanese);
    accentStrings.push(pitchStr);
    disabledsArray.push(disableds);
  });
  return {
    japanese: japaneses.join('\n'),
    accentString: accentStrings.join('\n'),
    disabledsArray,
  };
};

export const buildRhythmInitialValues = (questions: Question[]) => {
  const rhythmStringsObj: string[] = [];
  const disabledsArray: string[][][] = [];
  const audios: Audio[] = [];
  questions.forEach((question) => {
    const {
      audio,
      syllableUnits,
    }: { audio: Audio; syllableUnits: Rhythm[][] } = JSON.parse(
      question.question
    );

    audios.push(audio);
    rhythmStringsObj.push(buildRhythmString(syllableUnits || []));
    disabledsArray.push(
      syllableUnits.map((wordRhythm: Rhythm[]) =>
        wordRhythm.map((r) => r.disabled)
      )
    );
  });
  return {
    audios,
    rhythmString: rhythmStringsObj.join('\n'),
    disabledsArray,
    rhythmArray: rhythmStringsObj.map((item) => buildSentenceRhythm(item)),
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

export const buildUpdatedRythmState = (
  rhythmString: string,
  previousDisabledsArray: string[][][]
): { rhythmArray: Rhythm[][][]; disabledsArray: string[][][] } => {
  const rhythmStringLines = !!rhythmString ? rhythmString.split('\n') : [];
  const rhythmArray: Rhythm[][][] = rhythmStringLines.map((s) =>
    buildSentenceRhythm(s)
  );
  const disabledsArray = rhythmArray.map((sentenceRhythm, sentenceIndex) =>
    sentenceRhythm.map((wordRhythm, wordIndex) =>
      wordRhythm.map((_, syllableIndex) => {
        try {
          return previousDisabledsArray[sentenceIndex][wordIndex][
            syllableIndex
          ];
        } catch (e) {
          return '';
        }
      })
    )
  );
  return { rhythmArray, disabledsArray };
};

export const buildSentenceRhythm = (moraString: string) => {
  let index = -1;
  return moraString
    .split(SPACE) // 音節ごとに分ける
    .map((word, wordIndex) => {
      const moras: string[] = getMoras(word); // 拗音は2文字セット、それ以外は1文字に切り分ける
      let syllables: Rhythm[] = [];
      moras.forEach((mora, moraIndex) => {
        index++;
        // ①特殊拍以外のモーラで音節の配列を作る
        // 特殊拍は①の中に含める
        if (!isSpecialMora(mora, moras[moraIndex - 1])) {
          syllables.push({
            syllable: mora,
            index: index + wordIndex,
            mora: getSpecialMora({
              postMora: moras[moraIndex + 1],
              currentMora: mora,
              postPostMora: moras[moraIndex + 2],
            }),
            disabled: '' as never,
            longVowel: getLongVowel(
              mora,
              moras[moraIndex + 1],
              moras[moraIndex + 2]
            ),
          });
        }
      });
      return syllables;
    });
};

const isSpecialMora = (targetMora: string, preTargetMora?: string) => {
  let result = false;
  if (['っ', 'ん', 'ッ', 'ン', 'ー'].includes(targetMora)) {
    result = true;
  } else {
    if (!!preTargetMora) {
      const hiraPreMora = kanaToHira(preTargetMora);
      const preMoraVowel = !!KANA_ROMAJI_MAP[hiraPreMora]
        ? KANA_ROMAJI_MAP[hiraPreMora].slice(-1)
        : '';
      switch (targetMora) {
        case 'あ':
        case 'ア':
          result = ['a'].includes(preMoraVowel);
          break;
        case 'い':
        case 'イ':
          result = ['i', 'e'].includes(preMoraVowel);
          break;
        case 'う':
        case 'ウ':
          result = ['u', 'o'].includes(preMoraVowel);
          break;
        case 'え':
        case 'エ':
          result = ['e'].includes(preMoraVowel);
          break;
        case 'お':
        case 'オ':
          result = ['o'].includes(preMoraVowel);
          break;
        default:
      }
    }
  }
  return result;
};

// accentsを受け取って、　音節ごとに全空白を入れたひらがな文字列を返す
// accents = [
// {
//   moras: ['い', 'ま', 'は'],
//   pitchPoint: 1,
// },
// {
//   moras: ['て', 'っ', 'きょ', 'ー']
//   pitchPoint: 0,
// }
// ]

// return "いまは　てっきょー"
export const getMoraString = (accents: Accent[]) => {
  return accents
    .map((accent) => accent.moras.map((m) => kanaToHira(m)).join(''))
    .join(SPACE);
};

function kanaToHira(str: string) {
  return str.replace(/[\u30a1-\u30f6]/g, function (match) {
    var chr = match.charCodeAt(0) - 0x60;
    return String.fromCharCode(chr);
  });
}

const getSpecialMora = ({
  postMora,
  currentMora,
  postPostMora,
}: {
  currentMora: string;
  postMora?: string;
  postPostMora?: string;
}): SpecialMora & '' => {
  let result = '';

  if (!!postMora) {
    // 後ろにモーラがある場合
    if (isSpecialMora(postMora, currentMora)) {
      // それが特殊拍の場合
      if (['っ', 'ん', 'ッ', 'ン'].includes(postMora)) {
        // 長音以外は後ろのモーラをそのまま特殊拍とする
        result = postMora;
      } else {
        // 長音の場合、その後ろに「ん」「っ」が続くなら、それも含める
        result =
          'ー' +
          (!!postPostMora && ['ん', 'ン', 'っ', 'ッ'].includes(postPostMora)
            ? postPostMora
            : '');
      }
    }
  }
  return result as never;
};

const getLongVowel = (
  currentMora: string,
  postMora?: string,
  postPostMora?: string
) => {
  let result = '';
  if (!!postMora) {
    // 後ろにモーラがある場合
    if (isSpecialMora(postMora, currentMora)) {
      // それが特殊拍の場合
      if (!['っ', 'ん', 'ッ', 'ン'].includes(postMora)) {
        // 長音の場合、その後ろに「ん」「っ」が続くなら、それも含める
        result =
          postMora +
          (!!postPostMora && ['ん', 'ン', 'っ', 'ッ'].includes(postPostMora)
            ? postPostMora
            : '');
      }
    }
  }
  return result;
};

const buildRhythmString = (sentenceRhythm: Rhythm[][]) => {
  return sentenceRhythm
    .map((w) =>
      w.map((r) => r.syllable + (!!r.longVowel ? r.longVowel : r.mora)).join('')
    )
    .join(SPACE);
};

export const buildQuizFromRhythmQuizState = (
  state: State,
  rhythmQuizState: RhythmQuizState
): {
  quiz: QuestionSet;
  questions: Question[];
  questionIdsToDelete: string[];
} => {
  const { quiz, questions } = state;
  const { uid, users, title, audios, answered, rhythmString, disabledsArray } =
    rhythmQuizState;

  let questionCount = 0;
  const rhythmStringLines = rhythmString.split('\n');
  const sentenceRhythms = rhythmStringLines.map((s) => buildSentenceRhythm(s));
  disabledsArray.forEach((sentenceDisabled) => {
    sentenceDisabled.forEach((wordDisabled) => {
      questionCount++;
      if (
        wordDisabled.length ===
        wordDisabled.filter((disabled) => !!disabled).length
      ) {
        questionCount--;
      }
    });
  });
  const newQuiz: QuestionSet = {
    ...quiz,
    title,
    uid,
    answered: answered,
    userDisplayname: users.filter((user) => user.id === uid)[0].displayname,
    questionCount,
  };
  const newQuestions: Question[] = sentenceRhythms.map(
    (sentenceRhythm, sentenceIndex) => {
      const audio: Audio = audios[sentenceIndex];
      const japanese = '';
      const syllableUnits: Rhythm[][] = sentenceRhythm.map(
        (wordRhythm, wordIndex) =>
          wordRhythm.map((syllableRhythm, syllableIndex) => ({
            ...syllableRhythm,
            disabled: (disabledsArray[sentenceIndex][wordIndex][
              syllableIndex
            ] || '') as SpecialMora & '' & 'x',
          }))
      );
      const question = JSON.stringify({
        audio,
        japanese,
        syllableUnits,
      });
      return {
        ...questions[sentenceIndex],
        question,
      };
    }
  );
  const originalQuestionIds = questions.map((q) => q.id);
  const questionIdsToDelete = originalQuestionIds.slice(disabledsArray.length);

  return { quiz: newQuiz, questions: newQuestions, questionIdsToDelete };
};

export const submitQuiz = async (quiz: Quiz) => {
  console.log('update questionSet');
  const { id, ...omitted } = quiz;
  await updateDoc(doc(db, COLLECTIONS.quizzes, id), {
    ...omitted,
  });
};

export const buildAccentQuizFromState = (
  state: State
): {
  quiz: QuestionSet;
  questionGroup: QuestionGroup;
  questions: Question[];
} => {
  const { article, sentences } = state;
  const { title } = article;
  const quizId = nanoid(8);
  const questionGroupId = nanoid(8);
  const questions = sentences2AccentsQuestions({
    sentences,
    questionGroupId,
  });

  const questionGroup: QuestionGroup = {
    ...INITIAL_QUESTION_GROUP,
    id: questionGroupId,
    createdAt: Date.now(),
    questions: questions.map(({ id }) => id),
  };

  let questionCount = 0;
  sentences.forEach((sentence) => {
    const accents = sentence.accents;
    questionCount += accents.length;
  });

  const quiz: QuestionSet = {
    ...INITIAL_QUESTION_SET,
    id: quizId,
    uid: import.meta.env.VITE_ADMIN_UID,
    type: 'articleAccents',
    title: `${title} - アクセント`,
    createdAt: Date.now(),
    unlockedAt: Date.now(),
    questionCount,
    questionGroups: [questionGroupId],
    userDisplayname: '原田',
  };
  return { quiz, questionGroup, questions };
};

export const buildRhythmQuizFromState = (
  state: State
): {
  quiz: QuestionSet;
  questionGroup: QuestionGroup;
  questions: Question[];
} => {
  const { article, sentences } = state;
  const { downloadURL, title } = article;

  const quizId = nanoid(8);
  const questionGroupId = nanoid(8);
  const questions = sentences2RhythmQuestions({
    sentences,
    downloadURL,
    questionGroupId,
  });

  const questionGroup: QuestionGroup = {
    ...INITIAL_QUESTION_GROUP,
    id: questionGroupId,
    createdAt: Date.now(),
    questions: questions.map(({ id }) => id),
  };

  let questionCount = 0;
  questions.forEach((question) => {
    const { syllableUnits }: { syllableUnits: Rhythm[][] } = JSON.parse(
      question.question
    );
    questionCount += syllableUnits.length;
    syllableUnits;
  });

  const quiz: QuestionSet = {
    id: quizId,
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

  return { quiz, questionGroup, questions };
};

export const createQuiz = async (
  quiz: QuestionSet,
  questionGroup: QuestionGroup,
  questions: Question[]
) => {
  const { id: questionSetId, ...omittedQuiz } = quiz;
  console.log('set questionSet');
  await setDoc(doc(db, COLLECTIONS.questionSets, questionSetId), {
    ...omittedQuiz,
  });

  const { id: questionGroupId, ...omittedQuestionGroup } = questionGroup;
  console.log('set questionGroup');
  await setDoc(doc(db, COLLECTIONS.questionGroups, questionGroupId), {
    ...omittedQuestionGroup,
  });

  for (const question of questions) {
    const { id: questionId, ...omittedQuestion } = question;
    console.log('set question');
    await setDoc(doc(db, COLLECTIONS.questions, questionId), {
      ...omittedQuestion,
    });
  }
  return;
};

const sentences2RhythmQuestions = ({
  sentences,
  downloadURL,
  questionGroupId,
}: {
  sentences: {
    end: number;
    start: number;
    accents: Accent[];
  }[];
  downloadURL: string;
  questionGroupId: string;
}): Question[] => {
  return sentences.map(({ accents, end, start }, index) => {
    const moraString = getMoraString(accents);
    const question: Question = {
      ...INITIAL_QUESTION,
      id: nanoid(8),
      answers: [moraString],
      createdAt: new Date().getTime() + index,
      question: JSON.stringify({
        audio: { end, start, downloadURL },
        japanese: '',
        syllableUnits: buildSentenceRhythm(moraString),
      }),
      questionGroup: questionGroupId,
      type: 'articleRhythms',
    };
    return question;
  });
};

export const deleteQuiz = async (quizId: string) => {
  console.log('delete quiz');
  deleteDoc(doc(db, COLLECTIONS.quizzes, quizId));
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
}): Question[] => {
  return sentences.map(({ japanese, accents }, index) => {
    const question: Question = {
      ...INITIAL_QUESTION,
      id: nanoid(8),
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

const buildQuiz = (doc: DocumentData): Quiz => {
  const {
    uid,
    type,
    title,
    scores,
    questions,
    createdAt,
    downloadURL,
    questionCount,
  } = doc.data();
  return {
    id: doc.id,
    uid: uid || '',
    type: type || '',
    title: title || '',
    scores: scores || {},
    questions: questions || {},
    createdAt: createdAt || 0,
    downloadURL: downloadURL || '',
    questionCount: questionCount || 0,
  };
};
