import { DocumentData } from '@firebase/firestore';
import { User } from '../services/useUsers';

export const buildUser = (id: string, data: DocumentData) => {
  const user: User = {
    id,
    createdAt: data.createdAt,
    displayname: data.displayname,
  };
  return user;
};
