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
import { db } from '../repositories/firebase';
import {
  Article,
  ArticleSentence,
  ArticleSentenceForm,
  INITIAL_ARTICLE,
} from '../Model';

const COLLECTIONS = {
  articles: 'articles',
  sentences: 'sentences',
  aSentences: 'aSentences',
  assignments: 'assignments',
  sentenceParseNews: 'sentenceParseNews',
  articleSentenceForms: 'articleSentenceForms',
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

  let articleSentenceForms: ArticleSentenceForm[] = [];
  q = query(
    collection(db, COLLECTIONS.articleSentenceForms),
    where('articleId', '==', id),
    orderBy('lineIndex')
  );
  console.log('get articleSentenceForms');
  querySnapshot = await getDocs(q);
  querySnapshot.forEach((doc) => {
    articleSentenceForms.push(buildArticleSentenceForm(doc));
  });
  return {
    article,
    sentences,
    articleSentenceForms,
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

const buildArticleSentenceForm = (doc: DocumentData) => {
  const { articleId, lineIndex, sentences } = doc.data();
  const articleSentenceForm: ArticleSentenceForm = {
    id: doc.id || '',
    articleId: articleId || '',
    lineIndex: lineIndex || 0,
    sentences: sentences || {},
  };
  return articleSentenceForm;
};
