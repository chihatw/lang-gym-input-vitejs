import {
  collection,
  deleteDoc,
  doc,
  DocumentData,
  getDocs,
  orderBy,
  query,
  setDoc,
} from 'firebase/firestore';
import { nanoid } from 'nanoid';
import string2PitchesArray from 'string2pitches-array';
import {
  INITIAL_RANDOM_WORKOUT,
  INITIAL_WORKING_MEMORY,
  RandomWorkout,
  RandomWorkoutCue,
  State,
  User,
  WorkingMemory,
} from '../Model';
import {
  INITIAL_RANDOM_WORKOUT_FORM_STATE,
  RandomWorkoutFormState,
} from '../pages/RandomWorkout/RandomWorkoutEdit/Model';
import { db } from '../repositories/firebase';

const COLLECTIONS = {
  workingMemories: 'workingMemories',
};

export const getWorkingMemories = async (): Promise<{
  [id: string]: WorkingMemory;
}> => {
  const workingMemories: { [id: string]: WorkingMemory } = {};
  const q = query(
    collection(db, COLLECTIONS.workingMemories),
    orderBy('createdAt', 'desc')
  );
  console.log('get workingMemories');
  const querySnapshot = await getDocs(q);
  querySnapshot.forEach((doc) => {
    workingMemories[doc.id] = buildWorkingMemory(doc);
  });
  return workingMemories;
};

const buildWorkingMemory = (doc: DocumentData): WorkingMemory => {
  const { uid, logs, cueIds, title, offset, cueCount, isActive, createdAt } =
    doc.data();
  return {
    id: doc.id,
    uid: uid || '',
    cueIds: cueIds || [],
    title: title || '',
    offset: offset || 0,
    logs: logs || {},
    cueCount: cueCount || 0,
    isActive: isActive || false,
    createdAt: createdAt || 0,
  };
};
