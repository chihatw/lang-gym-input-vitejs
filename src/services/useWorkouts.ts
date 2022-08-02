import { DocumentData } from 'firebase/firestore';
import { useCallback, useMemo } from 'react';
import { Workout } from '../Model';
import { db } from '../repositories/firebase';
import {
  addDocument,
  deleteDocument,
  updateDocument,
} from '../repositories/utils';

const COLLECTION = 'workouts';

export const useHandleWorkouts = () => {
  const _addDocument = useMemo(
    () =>
      async function <T extends { id: string }>(
        value: Omit<T, 'id'>
      ): Promise<T | null> {
        return await addDocument({
          db,
          colId: COLLECTION,
          value,
        });
      },
    []
  );

  const _updateDocument = useMemo(
    () =>
      async function <T extends { id: string }>(value: T): Promise<T | null> {
        return await updateDocument({
          db,
          colId: COLLECTION,
          value,
        });
      },
    []
  );

  const _deleteDocument = useCallback(async (id: string) => {
    return await deleteDocument({ db, colId: COLLECTION, id });
  }, []);

  const createWorkout = async (
    workout: Omit<Workout, 'id'>
  ): Promise<Workout | null> => {
    return await _addDocument(workout);
  };

  const updateWorkout = async (workout: Workout): Promise<Workout | null> => {
    return await _updateDocument(workout);
  };
  const deleteWorkout = async (id: string) => {
    return await _deleteDocument(id);
  };

  return { createWorkout, updateWorkout, deleteWorkout };
};

const buildWorkout = (doc: DocumentData) => {
  const workout: Workout = {
    id: doc.id,
    beatCount: doc.data().beatCount || 0,
    createdAt: doc.data().createdAt || 0,
    createdAtStr: doc.data().createdAtStr || '',
    dateId: doc.data().dateId || '',
    hidden: doc.data().hidden || false,
    items: doc.data().items || [],
    label: doc.data().label || '',
    uid: doc.data().uid || '',
  };
  return workout;
};
