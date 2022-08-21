import getMoras from 'get-moras';
import { mora2Vowel } from 'mora2vowel';
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
  where,
} from 'firebase/firestore';
import { db, storage } from '../repositories/firebase';
import {
  Article,
  ArticleSentence,
  INITIAL_ARTICLE,
  State,
  Tags,
} from '../Model';
import { getDownloadURL, ref } from 'firebase/storage';
import { ArticleEditState } from '../pages/Article/EditArticlePage/Model';

const REMOVE_MARKS_REG_EXP = /[、。「」]/g;

const COLLECTIONS = {
  articles: 'articles',
  sentences: 'sentences',
  aSentences: 'aSentences',
  assignments: 'assignments',
  sentenceParseNews: 'sentenceParseNews',
};

export const getArticle = async (id: string) => {
  let article = INITIAL_ARTICLE;
  console.log('get article');
  let snapshot = await getDoc(doc(db, COLLECTIONS.articles, id));
  if (snapshot.exists()) {
    article = buildArticle(snapshot);
  }

  let sentences: ArticleSentence[] = [];
  let q = query(
    collection(db, COLLECTIONS.sentences),
    where('article', '==', id),
    orderBy('line')
  );
  console.log('get sentences');
  let querySnapshot = await getDocs(q);
  querySnapshot.forEach((doc) => {
    sentences.push(buildSentence(doc));
  });

  let articleBlob: Blob | null = null;
  let { downloadURL } = article;
  if (downloadURL) {
    const header = downloadURL.slice(0, 4);
    if (header !== 'http') {
      downloadURL = await getDownloadURL(ref(storage, downloadURL));
    }

    console.log('create article blob');
    const response = await fetch(downloadURL);
    articleBlob = await response.blob();
  }

  return {
    article,
    sentences,
    articleBlob,
  };
};

export const getArticles = async () => {
  const articleList: Article[] = [];
  let q = query(
    collection(db, COLLECTIONS.articles),
    orderBy('createdAt', 'desc'),
    limit(6)
  );
  console.log('get articles');
  let querySnapshot = await getDocs(q);
  querySnapshot.forEach((doc) => {
    articleList.push(buildArticle(doc));
  });
  return articleList;
};

export const setArticle = async (article: Article) => {
  const { id, ...omitted } = article;
  console.log('set article');
  await setDoc(doc(db, COLLECTIONS.articles, id), { ...omitted });
};

export const setSentences = async (sentences: ArticleSentence[]) => {
  for (const sentence of sentences) {
    const { id, ...omitted } = sentence;
    console.log('set sentence');
    await setDoc(doc(db, COLLECTIONS.sentences, id), { ...omitted });
  }
};

export const updateSentence = async (sentence: ArticleSentence) => {
  const { id, ...omitted } = sentence;
  console.log('update sentence');
  await updateDoc(doc(db, COLLECTIONS.sentences, id), { ...omitted });
};

export const deleteArticle = async (articleId: string) => {
  let q = query(
    collection(db, COLLECTIONS.sentences),
    where('article', '==', articleId)
  );
  console.log('get sentences');
  let querySnapshot = await getDocs(q);
  querySnapshot.forEach(async (_doc) => {
    console.log('delete sentence');
    await deleteDoc(doc(db, COLLECTIONS.sentences, _doc.id));
  });

  console.log('delete article');
  await deleteDoc(doc(db, COLLECTIONS.articles, articleId));
};

export const buildArticleEditState = (state: State): ArticleEditState => {
  const { users, article, sentences } = state;
  const { id, uid, createdAt, title, embedID } = article;

  if (!id) {
    return {
      uid: users.length ? users[0].id : '',
      date: new Date(),
      users,
      title: '',
      embedId: '',
      articleMarksString: '',
    };
  }

  let articleMarksString = '';
  if (sentences.length) {
    const lines: string[] = [];
    sentences.forEach(({ japanese }, index) => {
      const items: string[] = [];
      const mark = article.marks[index];
      const initial = index === 0 ? '' : '0:00';
      items.push(mark || initial);
      const hasMore = japanese.length > 5 ? '…' : '';
      items.push(japanese.slice(0, 5) + hasMore);
      const line = items.join(' ');
      lines.push(line);
    });
    articleMarksString = lines.join('\n');
  }

  return {
    uid,
    date: new Date(createdAt),
    users,
    title,
    embedId: embedID,
    articleMarksString,
  };
};

const buildArticle = (doc: DocumentData) => {
  const {
    uid,
    marks,
    title,
    embedID,
    createdAt,
    isShowParse,
    downloadURL,
    hasRecButton,
    isShowAccents,
    userDisplayname,
  } = doc.data();
  const article: Article = {
    id: doc.id,
    uid: uid || '',
    marks: marks || [],
    title: title || '',
    embedID: embedID || '',
    createdAt: createdAt || 0,
    isShowParse: isShowParse || false,
    downloadURL: downloadURL || '',
    hasRecButton: hasRecButton || false,
    isShowAccents: isShowAccents || false,
    userDisplayname: userDisplayname || '',
  };
  return article;
};

const buildSentence = (doc: DocumentData) => {
  const {
    uid,
    end,
    tags,
    kana,
    line,
    start,
    title,
    accents,
    article,
    chinese,
    japanese,
    original,
    createdAt,
    kanaAccentsStr,
    storagePath,
    storageDuration,
  } = doc.data();
  const sentence: ArticleSentence = {
    id: doc.id,
    uid: uid || '',
    end: end || 0,
    tags: tags || {},
    kana: kana || '',
    line: line || 0,
    start: start || 0,
    title: title || '',
    accents: accents || [],
    article: article || '',
    chinese: chinese || '',
    japanese: japanese || '',
    original: original || '',
    createdAt: createdAt || 0,
    kanaAccentsStr: kanaAccentsStr || '',
    storagePath: storagePath || '',
    storageDuration: storageDuration || 0,
  };
  return sentence;
};

export const kanaAccentsStr2Kana = (value: string) => {
  return kana2Hira(value.replace(/[　＼]/g, ''));
};

const kana2Hira = (str: string): string => {
  return str.replace(/[\u30a1-\u30f6]/g, function (match) {
    var chr = match.charCodeAt(0) - 0x60;
    return String.fromCharCode(chr);
  });
};

export const kanaAccentsStr2AccentsString = (value: string) => {
  let removedMarksStr = value.replace(REMOVE_MARKS_REG_EXP, '');

  const words = removedMarksStr.split('　');
  const newWords: string[] = [];
  for (const word of words) {
    // 「＼」で分割
    const moraGroups = word.split('＼');
    const newMoraGroups: string[] = [];
    let preMoras: string[] = [];
    for (let i = 0; i < moraGroups.length; i++) {
      const moraGroup = moraGroups[i];
      const moras = getMoras(moraGroup);
      const newMoras: string[] = [];
      for (let j = 0; j < moras.length; j++) {
        const newMora = getNewMora({
          targetMora: moras[j],
          // moras の先頭は、「＼」で区切られたひとつ前のモーラと長音関係かどうかをチェックする
          // じゆ＼う　　moras = ['じゆ', 'う'] 「う」の時、「ゆ」と長音関係かどうかをチェック
          preMora: moras[j - 1] || preMoras.slice(-1)[0],
        });
        newMoras.push(newMora);
      }
      // 現在のモーラを、preMoras に代入
      preMoras = moras;
      newMoraGroups.push(newMoras.join(''));
    }
    newWords.push(newMoraGroups.join('＼'));
  }

  return newWords.join('　');
};

const getNewMora = ({
  targetMora,
  preMora,
}: {
  targetMora: string;
  preMora?: string;
}) => {
  if (!preMora) {
    return targetMora;
  }
  const isLongVowel = checkLongVowel({ targetMora, preMora });
  if (isLongVowel) {
    return 'ー';
  }
  return targetMora;
};

const checkLongVowel = ({
  targetMora,
  preMora,
}: {
  targetMora: string;
  preMora: string;
}) => {
  const preMoraVowel = mora2Vowel(preMora);
  switch (targetMora) {
    case 'あ':
    case 'ア':
      return preMoraVowel === 'a';
    case 'い':
    case 'イ':
      return ['i', 'e'].includes(preMoraVowel);
    case 'う':
    case 'ウ':
      return ['u', 'o'].includes(preMoraVowel);
    case 'え':
    case 'エ':
      return preMoraVowel === 'e';
    case 'お':
    case 'オ':
      return preMoraVowel === 'o';
    default:
      return false;
  }
};

export const buildTags = (linesArray: string[]) => {
  const tags: Tags = {};
  linesArray.forEach((lines) => {
    lines.split('\n').forEach((line) => {
      Array.from(line).forEach((_, i) => {
        // uni-gram
        tags[line.slice(i, i + 1)] = true;
        // bi-gram
        if (i + 1 < line.length) {
          tags[line.slice(i, i + 2)] = true;
        }
      });
    });
  });
  return tags;
};

export const buildArticleMarks = (value: string) => {
  let articleMarks: string[] = [];
  const lines = value.split('\n');
  lines.forEach((line) => {
    const items = line.split(' ');
    articleMarks.push(items[0]);
  });
  return articleMarks;
};
