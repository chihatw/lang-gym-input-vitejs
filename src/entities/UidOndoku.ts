import firebase from 'firebase/app';
export type UidOndoku = {
  id: string;
  createdAt: number;
  ondoku: firebase.firestore.DocumentReference;
  uid: string;
};

export type CreateUidOndoku = Omit<UidOndoku, 'id'>;

export const buildUidOndoku = (
  id: string,
  data: firebase.firestore.DocumentData
) => {
  const uidOndoku: UidOndoku = {
    id,
    createdAt: data.createdAt,
    ondoku: data.ondoku,
    uid: data.uid,
  };
  return uidOndoku;
};
