import { DocumentData } from '@firebase/firestore';

export type User = {
  id: string;
  createdAt: number;
  displayname: string;
};

export const buildUser = (id: string, data: DocumentData) => {
  const user: User = {
    id,
    createdAt: data.createdAt,
    displayname: data.displayname,
  };
  return user;
};
