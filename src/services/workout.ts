import {
  collection,
  doc,
  DocumentData,
  getDoc,
  getDocs,
  limit,
  orderBy,
  query,
  startAfter,
  updateDoc,
  where,
} from 'firebase/firestore';
import { INITIAL_WORKOUT, Workout } from '../Model';
import { db } from '../repositories/firebase';

const COLLECTIONS = {
  workouts: 'workouts',
};

export const getWorkout = async (id: string) => {
  const snapshot = await getDoc(doc(db, COLLECTIONS.workouts, id));
  if (!snapshot.exists()) return INITIAL_WORKOUT;
  return buildWorkout(snapshot);
};

export const getWorkouts = async () => {
  const workoutList: Workout[] = [];
  const q = query(
    collection(db, COLLECTIONS.workouts),
    orderBy('createdAt', 'desc'),
    limit(6)
  );
  const querySnapshot = await getDocs(q);
  querySnapshot.forEach((doc) => {
    workoutList.push(buildWorkout(doc));
  });

  return workoutList;
};

const buildWorkout = (doc: DocumentData) => {
  const {
    beatCount,
    createdAt,
    createdAtStr,
    dateId,
    hidden,
    items,
    label,
    uid,
  } = doc.data();
  const workout: Workout = {
    id: doc.id,
    beatCount: beatCount || 0,
    createdAt: createdAt || 0,
    createdAtStr: createdAtStr || '',
    dateId: dateId || '',
    hidden: hidden || false,
    items: items || [],
    label: label || '',
    uid: uid || '',
  };
  return workout;
};
