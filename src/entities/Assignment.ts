import { DocumentData } from '@firebase/firestore';

export type Assignment = {
  id: string;
  uid: string;
  ondoku: string;
  article: string;
  downloadURL: string;
};

export const INITIAL_ASSIGNMENT: Assignment = {
  id: '',
  uid: '',
  ondoku: '',
  article: '',
  downloadURL: '',
};

export type CreateAssignment = Omit<Assignment, 'id'>;

export const buildAssignment = (id: string, data: DocumentData) => {
  const assignment: Assignment = {
    id,
    article: data.article,
    downloadURL: data.downloadURL,
    ondoku: data.ondoku,
    uid: data.uid,
  };
  return assignment;
};
