import {
  doc,
  setDoc,
  updateDoc,
  Firestore,
  onSnapshot,
  Unsubscribe,
} from 'firebase/firestore';

// ドキュメントの value フィールドの値を取得する（フィールド名固定）
export const snapshotDocumentValue = <T>({
  db,
  docId,
  colId,
  initialValue,
  setValue,
}: {
  db: Firestore;
  docId: string;
  colId: string;
  initialValue: T;
  setValue: (value: T) => void;
}): Unsubscribe => {
  return onSnapshot(
    doc(db, colId, docId),
    (snapshot) => {
      console.log(`snapshot ${colId}.${docId}`);
      if (snapshot.exists()) {
        const value: T = snapshot.data().value;
        if (!!value) {
          setValue(value);
        } else {
          setValue(initialValue);
        }
      } else {
        setValue(initialValue);
      }
    },
    (e) => {
      console.warn(e);
      setValue(initialValue);
    }
  );
};

// ドキュメントの value フィールドの値を更新する（フィールド名固定）
export const updateDocumenValue = async <T>({
  db,
  value,
  colId,
  docId,
}: {
  db: Firestore;
  colId: string;
  value: T;
  docId: string;
}): Promise<T | null> => {
  console.log(`update ${colId}.${docId}`);
  return await updateDoc(doc(db, colId, docId), { value })
    .then(() => {
      return value;
    })
    .catch((e) => {
      console.warn(e);
      return null;
    });
};

// ドキュメントの value フィールドの値を設定する（フィールド名固定）
export const setDocumenValue = async <T>({
  db,
  value,
  colId,
  docId,
}: {
  db: Firestore;
  colId: string;
  value: T;
  docId: string;
}): Promise<T | null> => {
  console.log(`set ${colId}.${docId}`);
  return await setDoc(doc(db, colId, docId), { value })
    .then(() => {
      return value;
    })
    .catch((e) => {
      console.warn(e);
      return null;
    });
};
