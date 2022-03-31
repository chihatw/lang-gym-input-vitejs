import { DocumentData } from '@firebase/firestore';

export type Article = {
  id: string;
  createdAt: number;
  isShowAccents: boolean;
  title: string;
  uid: string;
  userDisplayname: string;
  downloadURL: string;
  embedID: string;
  isShowParse: boolean;
  marks: string[];
};

export type CreateArticle = Omit<Article, 'id'>;

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
