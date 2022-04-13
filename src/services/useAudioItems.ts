import {
  doc,
  deleteDoc,
  Unsubscribe,
  DocumentData,
  QueryConstraint,
} from '@firebase/firestore';
import { useEffect, useMemo, useState } from 'react';
import { db } from '../repositories/firebase';
import { snapshotCollection } from '../repositories/utils';

export type AudioItem = {
  id: string;
  uid: string;
  bpm: number;
  dateId: string;
  dataURI: string;
  workoutId: string;
  isPerfect: boolean;
  isDeleted: boolean;
};

const COLLECTION = 'audioItems';

const useAudioItems = () => {
  const [audioItems, setAudioItems] = useState<AudioItem[]>([]);

  const _snapshotCollection = useMemo(
    () =>
      function <T>({
        limit,
        queries,
        setValues,
        buildValue,
      }: {
        limit?: number;
        queries?: QueryConstraint[];
        setValues: (value: T[]) => void;
        buildValue: (value: DocumentData) => T;
      }): Unsubscribe {
        return snapshotCollection({
          db,
          colId: COLLECTION,
          limit,
          queries,
          setValues,
          buildValue,
        });
      },
    []
  );

  useEffect(() => {
    const unsub = _snapshotCollection({
      setValues: setAudioItems,
      buildValue: buildAudioItem,
    });

    return () => unsub();
  }, []);

  const deleteAudioItem = (id: string) => {
    if (window.confirm('delete?')) {
      deleteDoc(doc(db, COLLECTION, id));
    }
  };

  return { audioItems, deleteAudioItem };
};

export default useAudioItems;

const buildAudioItem = (doc: DocumentData) => {
  const audioItem: AudioItem = {
    id: doc.data().id,
    uid: doc.data().uid,
    bpm: doc.data().bpm,
    dateId: doc.data().dateId,
    dataURI: doc.data().dataURI,
    workoutId: doc.data().workoutId,
    isPerfect: doc.data().isPerfect,
    isDeleted: doc.data().isDeleted,
  };
  return audioItem;
};
