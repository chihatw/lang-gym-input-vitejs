import {
  limit,
  orderBy,
  collection,
  Unsubscribe,
  DocumentData,
  QueryConstraint,
} from 'firebase/firestore';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { db } from '../repositories/firebase';
import {
  addDocument,
  deleteDocument,
  updateDocument,
  snapshotCollection,
} from '../repositories/utils';

export type WorkoutItem = {
  text: string;
  chinese: string;
  pitchesArray: string;
};

export const INITIAL_WORKOUT_ITEM: WorkoutItem = {
  text: '',
  chinese: '',
  pitchesArray: '',
};

export type Workout = {
  id: string;
  beatCount: number;
  createdAt: number;
  createdAtStr: string;
  dateId: string;
  hidden: boolean;
  items: WorkoutItem[];
  label: string;
  uid: string;
};

export const INITIAL_WORKOUT: Workout = {
  id: '',
  beatCount: 0,
  createdAt: 0,
  createdAtStr: '',
  dateId: '',
  hidden: true,
  items: [],
  label: '',
  uid: '',
};

const COLLECTION = 'workouts';
const colRef = collection(db, COLLECTION);

export const useWorkouts = ({ workoutId }: { workoutId: string }) => {
  const [workout, setWorkout] = useState(INITIAL_WORKOUT);
  const [workouts, setWorkouts] = useState<Workout[]>([]);

  useEffect(() => {
    const workout = workouts.filter((workout) => workout.id === workoutId)[0];
    setWorkout(workout || INITIAL_WORKOUT);
  }, [workoutId, workouts]);

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
      queries: [orderBy('createdAt', 'desc'), limit(6)],
      setValues: setWorkouts,
      buildValue: buildWorkout,
    });
    return () => {
      unsub();
    };
  }, []);

  return { workout, workouts };
};
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
