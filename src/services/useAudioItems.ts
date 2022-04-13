import {
  Unsubscribe,
  DocumentData,
  QueryConstraint,
} from '@firebase/firestore';
import { useCallback, useEffect, useMemo, useState } from 'react';

import { db } from '../repositories/firebase';
import { deleteDocument, snapshotCollection } from '../repositories/utils';

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

export const useAudioItems = () => {
  const [audioItems, setAudioItems] = useState<AudioItem[]>([]);

  const _snapshotCollection = useMemo(
    () =>
      function <T>({
        queries,
        setValues,
        buildValue,
      }: {
        queries?: QueryConstraint[];
        setValues: (value: T[]) => void;
        buildValue: (value: DocumentData) => T;
      }): Unsubscribe {
        return snapshotCollection({
          db,
          colId: COLLECTION,
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

  return { audioItems };
};

export const useHandleAudioItems = () => {
  const _deleteDocument = useCallback(async (id: string) => {
    return await deleteDocument({ db, colId: COLLECTION, id });
  }, []);
  const deleteAudioItem = (id: string) => {
    if (window.confirm('delete?')) {
      _deleteDocument(id);
    }
  };
  return { deleteAudioItem };
};

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
