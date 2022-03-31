import { DocumentData, DocumentReference } from '@firebase/firestore';
export type UidOndoku = {
  id: string;
  createdAt: number;
  ondoku: DocumentReference;
  uid: string;
};

export type CreateUidOndoku = Omit<UidOndoku, 'id'>;

export const buildUidOndoku = (id: string, data: DocumentData) => {
  const uidOndoku: UidOndoku = {
    id,
    createdAt: data.createdAt,
    ondoku: data.ondoku,
    uid: data.uid,
  };
  return uidOndoku;
};
