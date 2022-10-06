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
} from 'firebase/firestore';
import getMoras from 'get-moras';

import {
  Accent,
  State,
  INITIAL_QUIZ_QUESTION,
  Quiz,
  QuizQuestion,
  QuizQuestions,
  Syllable,
  INITIAL_QUIZ,
} from '../Model';
import { db, storage } from '../repositories/firebase';

import {
  INITIAL_RHYTHM_QUIZ_FORM_STATE,
  RhythmQuizFromState,
} from '../pages/Quiz/RhythmQuizPage/Model';
import { getDownloadURL, ref } from 'firebase/storage';
import { PitchQuizFormState } from '../pages/Quiz/PitchQuizPage/Model';
import accentsForPitchesArray from 'accents-for-pitches-array';
import pitchesArray2String from 'pitches-array2string';
import { getBlobFromArticleDownloadURL } from './article';

const SPACE = '　';

const COLLECTIONS = {
  quizzes: 'quizzes',
};

export const getBlob = async (downloadURL: string) => {
  let blob = null;

  if (downloadURL) {
    const header = downloadURL.slice(0, 4);
    if (header !== 'http') {
      downloadURL = await getDownloadURL(ref(storage, downloadURL));
    }
    console.log('create blob');
    const response = await fetch(downloadURL);
    blob = await response.blob();
  }
  return blob;
};

export const getQuiz = async (id: string) => {
  console.log('get quiz');
  const snapshot = await getDoc(doc(db, COLLECTIONS.quizzes, id));
  if (!snapshot.exists()) {
    return INITIAL_QUIZ;
  }
  return buildQuiz(snapshot);
};

export const getQuizzes = async (): Promise<{ [id: string]: Quiz }> => {
  let quizzes: { [id: string]: Quiz } = {};
  let q = query(
    collection(db, COLLECTIONS.quizzes),
    // 新しいものが前
    orderBy('createdAt', 'desc'),
    limit(20)
  );
  console.log('get quizzes');
  let querySnapshot = await getDocs(q);
  querySnapshot.forEach((doc) => {
    quizzes[doc.id] = buildQuiz(doc);
  });
  return quizzes;
};

export const buildPitchQuizFormState = async (
  state: State,
  quizId: string
): Promise<PitchQuizFormState> => {
  let quiz = state.quizzes[quizId] || INITIAL_QUIZ;
  if (!quiz.id) {
    quiz = await getQuiz(quizId);
  }

  let blob: Blob | null = null;
  if (quiz.downloadURL) {
    blob =
      state.blobs[quiz.downloadURL] ||
      (await getBlobFromArticleDownloadURL(quiz.downloadURL));
  }

  return {
    uid: quiz.uid,
    blob: null,
    users: state.users,
    title: quiz.title,
    questionCount: quiz.questionCount,
    input: {
      pitch: Object.values(quiz.questions)
        .map(({ pitchStr }) => pitchStr)
        .join('\n'),
      japanese: Object.values(quiz.questions)
        .map(({ japanese }) => japanese)
        .join('\n'),
    },
    scores: quiz.scores,
    audioContext: state.audioContext,
    questions: Object.values(quiz.questions),
  };
};

export const buildRhythmInitialValues = (
  state: State,
  quizId: string
): RhythmQuizFromState => {
  const quiz = state.quizzes[quizId];
  if (!quiz) return INITIAL_RHYTHM_QUIZ_FORM_STATE;

  const kanas: string[] = [];
  Object.values(quiz.questions).forEach((question) => {
    const kana = buildKanaSentence(Object.values(question.syllables));
    kanas.push(kana);
  });

  return {
    uid: quiz.uid || '',
    blob: state.blobs[quiz.downloadURL] || null,
    users: state.users,
    title: quiz.title || '',
    questionCount: quiz.questionCount || 0,
    input: { kana: kanas.join('\n') },
    questions: Object.values(quiz.questions),
    scores: quiz.scores || {},
    audioContext: state.audioContext || null,
    createdAt: quiz.createdAt || 0,
    type: quiz.type || 'articleRhythms',
    downloadURL: quiz.downloadURL || '',
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
  rhythmString: string
): Syllable[][][] => {
  const rhythmStringLines = !!rhythmString ? rhythmString.split('\n') : [];
  const updatedRhythmArray: Syllable[][][] = [];
  rhythmStringLines.forEach((s) => {
    const { sentenceRhythm } = buildSentenceRhythm(s);
    updatedRhythmArray.push(sentenceRhythm);
  });

  return updatedRhythmArray;
};

export const buildSentenceRhythm = (
  moraString: string
): { sentenceRhythm: Syllable[][] } => {
  const sentenceRhythm = moraString
    .split(SPACE) // 音節ごとに分ける
    .map((word) => {
      const moras: string[] = getMoras(word); // 拗音は2文字セット、それ以外は1文字に切り分ける
      let syllables: Syllable[] = [];
      moras.forEach((mora, moraIndex) => {
        // ①特殊拍以外のモーラで音節の配列を作る
        // 特殊拍は①の中に含める
        if (!isSpecialMora(mora, moras[moraIndex - 1])) {
          syllables.push({
            kana: mora,
            // index: index + wordIndex,
            specialMora: getSpecialMora({
              postMora: moras[moraIndex + 1],
              currentMora: mora,
              postPostMora: moras[moraIndex + 2],
            }),
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
  return { sentenceRhythm };
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
// will delete
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
}): string => {
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
  return result;
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

export const buildKanaSentence = (
  sentenceRhythm: { kana: string; longVowel: string; specialMora: string }[][]
) => {
  return sentenceRhythm
    .map((wordRhythm) =>
      wordRhythm
        .map(
          ({ kana, longVowel, specialMora }) =>
            kana + (longVowel || specialMora)
        )
        .join('')
    )
    .join(SPACE);
};

export const setQuiz = async (quiz: Quiz) => {
  console.log('set quiz');
  const { id, ...omitted } = quiz;
  await setDoc(doc(db, COLLECTIONS.quizzes, id), {
    ...omitted,
  });
};

export const buildPitchQuizFromState = (
  state: State,
  articleId: string
): Quiz => {
  let questionCount = 0;
  const questions: QuizQuestions = {};
  state.sentences[articleId].forEach((sentence, index) => {
    questionCount += sentence.accents.length;
    const pitchesArray = accentsForPitchesArray(sentence.accents);
    const pitchStr = pitchesArray2String(pitchesArray);
    questions[index] = {
      ...INITIAL_QUIZ_QUESTION,
      pitchStr,
      japanese: sentence.japanese,
    };
  });

  const quiz: Quiz = {
    id: nanoid(8),
    uid: import.meta.env.VITE_ADMIN_UID,
    type: 'articleAccents',
    title: `${state.articles[articleId].title} - アクセント`,
    scores: {},
    questions,
    createdAt: Date.now(),
    downloadURL: '',
    questionCount,
  };
  return quiz;
};

export const buildRhythmQuizFromState = (
  state: State,
  articleId: string
): Quiz => {
  let questionCount = 0;
  const questions: QuizQuestions = {};

  state.sentences[articleId].forEach((sentence, index) => {
    const syllables: { [index: number]: Syllable[] } = {};

    const pitchesArray = accentsForPitchesArray(sentence.accents);
    const moraString = pitchesArray
      .map((wordPitch) => wordPitch.map((mora) => kanaToHira(mora[0])).join(''))
      .join(SPACE);
    const { sentenceRhythm } = buildSentenceRhythm(moraString);
    questionCount += sentenceRhythm.length;
    sentenceRhythm.forEach((wordRhythm, index) => {
      syllables[index] = wordRhythm;
    });

    const question: QuizQuestion = {
      ...INITIAL_QUIZ_QUESTION,
      end: sentence.end,
      start: sentence.start,
      syllables,
    };
    questions[index] = question;
  });

  const quiz: Quiz = {
    id: nanoid(8),
    uid: import.meta.env.VITE_ADMIN_UID,
    type: 'articleRhythms',
    title: `${state.articles[articleId].title} - 特殊拍`,
    scores: {},
    questions,
    createdAt: new Date().getTime(),
    downloadURL: state.articles[articleId].downloadURL,
    questionCount,
  };

  return quiz;
};

export const createQuiz = async (quiz: Quiz) => {
  const { id, ...omitted } = quiz;
  console.log('set quiz');
  await setDoc(doc(db, COLLECTIONS.quizzes, id), {
    ...omitted,
  });
  return;
};

export const deleteQuiz = async (quizId: string) => {
  console.log('delete quiz');
  deleteDoc(doc(db, COLLECTIONS.quizzes, quizId));
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
