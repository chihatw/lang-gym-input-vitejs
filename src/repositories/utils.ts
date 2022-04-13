import {
  doc,
  query,
  addDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  Firestore,
  onSnapshot,
  collection,
  Unsubscribe,
  DocumentData,
  QueryConstraint,
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

export const snapshotDocument = <T>({
  db,
  id,
  colId,
  setValue,
  buildValue,
  initialValue,
}: {
  db: Firestore;
  id: string;
  colId: string;
  initialValue: T;
  setValue: (value: T) => void;
  buildValue: (value: DocumentData) => T;
}): Unsubscribe => {
  return onSnapshot(
    doc(db, colId, id),
    (snapshot) => {
      console.log(`snapshot ${colId}.${id}`);
      if (snapshot.exists()) {
        const value = buildValue(snapshot);
        setValue(value);
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

export const snapshotCollection = <T>({
  db,
  colId,
  queries,
  setValues,
  buildValue,
}: {
  db: Firestore;
  colId: string;
  queries?: QueryConstraint[];
  setValues: (values: T[]) => void;
  buildValue: (value: DocumentData) => T;
}): Unsubscribe => {
  let q = query(collection(db, colId));
  if (!!queries) {
    for (let _q of queries) {
      q = query(q, _q);
    }
  }
  return onSnapshot(
    q,
    (snapshot) => {
      console.log(`snap shot ${colId}`);
      const values: T[] = [];
      snapshot.forEach((doc) => {
        const value = buildValue(doc);
        values.push(value);
      });
      setValues(values);
    },
    (e) => {
      console.warn(e);
      setValues([]);
    }
  );
};

export const snapshotDocumentByQuery = <T>({
  db,
  colId,
  queries,
  initialValue,
  setValue,
  buildValue,
}: {
  db: Firestore;
  colId: string;
  queries?: QueryConstraint[];
  initialValue: T;
  setValue: (values: T) => void;
  buildValue: (value: DocumentData) => T;
}): Unsubscribe => {
  let q = query(collection(db, colId));
  if (!!queries) {
    for (let _q of queries) {
      q = query(q, _q);
    }
  }
  return onSnapshot(
    q,
    (snapshot) => {
      console.log(`snap shot ${colId}`);
      if (snapshot.size > 0) {
        const doc = snapshot.docs[0];

        const value = buildValue(doc);
        setValue(value);
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

export const updateDocument = async <T extends { id: string }>({
  db,
  colId,
  value,
}: {
  db: Firestore;
  colId: string;
  value: T;
}): Promise<T | null> => {
  const { id, ...omitted } = value;
  console.log(`update doc of ${colId}.${id}`);
  return await updateDoc(doc(db, colId, id), { ...omitted })
    .then(() => {
      return value;
    })
    .catch((e) => {
      console.warn(e);
      return null;
    });
};

export const setDocument = async <T extends { id: string }>({
  db,
  colId,
  value,
}: {
  db: Firestore;
  colId: string;
  value: T;
}): Promise<T | null> => {
  const { id, ...omitted } = value;
  console.log(`%cset doc of ${colId}.${id}`, 'color:red');
  return await setDoc(doc(db, colId, id), { ...omitted })
    .then(() => {
      return value;
    })
    .catch((e) => {
      console.warn(e);
      return null;
    });
};

export const addDocument = async <T extends { id: string }>({
  db,
  colId,
  value,
}: {
  db: Firestore;
  colId: string;
  value: Omit<T, 'id'>;
}): Promise<T | null> => {
  console.log(`add doc to ${colId}`);
  return await addDoc(collection(db, colId), value)
    .then((doc) => {
      return { id: doc.id, ...value } as T;
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

export const deleteDocument = async ({
  id,
  db,
  colId,
}: {
  id: string;
  db: Firestore;
  colId: string;
}): Promise<boolean> => {
  console.log(`delete ${colId}.${id}`);
  return await deleteDoc(doc(db, colId, id))
    .then(() => {
      return true;
    })
    .catch((e) => {
      console.warn(e);
      return false;
    });
};
