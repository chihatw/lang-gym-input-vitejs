import { DocumentData } from '@firebase/firestore';
import { Article } from '../services/useArticles';

export const buildArticle = (id: string, data: DocumentData) => {
  const article: Article = {
    id,
    uid: data.uid,
    title: data.title,
    embedID: data.embedID,
    createdAt: data.createdAt,
    isShowParse: data.isShowParse,
    downloadURL: data.downloadURL,
    isShowAccents: data.isShowAccents,
    userDisplayname: data.userDisplayname,
    marks: data.marks,
  };
  return article;
};
