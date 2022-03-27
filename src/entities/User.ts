import firebase from 'firebase/app';

export type User = {
  id: string;
  createdAt: number;
  displayname: string;
};

export const buildUser = (
  id: string,
  data: firebase.firestore.DocumentData
) => {
  const user: User = {
    id,
    createdAt: data.createdAt,
    displayname: data.displayname,
  };
  return user;
};
