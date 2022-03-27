import firebase from 'firebase/app';

export type Ondoku = {
  id: string;
  createdAt: number;
  downloadURL: string;
  isShowAccents: boolean;
  title: string;
};

export type CreateOndoku = Omit<Ondoku, 'id'>;

export type UpdateOndoku = Omit<Ondoku, 'id'>;

export const buildOndoku = (
  id: string,
  data: firebase.firestore.DocumentData
) => {
  const ondoku: Ondoku = {
    id,
    createdAt: data.createdAt,
    downloadURL: data.downloadURL,
    isShowAccents: data.isShowAccents,
    title: data.title,
  };
  return ondoku;
};
