import {
  collection,
  deleteDoc,
  doc,
  DocumentData,
  getDoc,
  getDocs,
  orderBy,
  query,
  setDoc,
} from 'firebase/firestore';
import { nanoid } from 'nanoid';
import string2PitchesArray from 'string2pitches-array';
import {
  INITIAL_RANDOM_WORKOUT,
  RandomWorkout,
  RandomWorkoutCue,
} from '../Model';
import { db } from '../repositories/firebase';

const COLLECTIONS = {
  randomWorkouts: 'randomWorkouts',
};

export const getRandomWorkout = async (id: string) => {
  const docSnapshot = await getDoc(doc(db, COLLECTIONS.randomWorkouts, id));
  if (!docSnapshot.exists()) {
    return INITIAL_RANDOM_WORKOUT;
  }
  const randomWorkout = buildRandomWorkout(docSnapshot);
  return randomWorkout;
};

export const getRandomWorkouts = async () => {
  const randomWorkouts: { [key: string]: RandomWorkout } = {};
  let q = query(
    collection(db, COLLECTIONS.randomWorkouts),
    orderBy('createdAt')
  );
  console.log('get randomWorkouts');
  let querySnapshot = await getDocs(q);
  querySnapshot.forEach((doc) => {
    randomWorkouts[doc.id] = buildRandomWorkout(doc);
  });
  return randomWorkouts;
};

export const setRandomWorkout = async (workout: RandomWorkout) => {
  // フォームで使った余分なプロパティを削除
  type Keys = keyof RandomWorkout;
  for (const key of Object.keys(workout)) {
    if (!Object.keys(INITIAL_RANDOM_WORKOUT).includes(key)) {
      delete workout[key as Keys];
    }
  }

  const { id, ...omitted } = workout;
  console.log('set randomWorkout');
  await setDoc(doc(db, COLLECTIONS.randomWorkouts, id), { ...omitted });
};

export const deleteRandomWorkout = async (id: string) => {
  console.log('delete randomWorkout');
  await deleteDoc(doc(db, COLLECTIONS.randomWorkouts, id));
};

const buildRandomWorkout = (doc: DocumentData) => {
  const {
    uid,
    cues,
    title,
    cueIds,
    resultBpm,
    targetBpm,
    beatCount,
    roundCount,
    createdAt,
    resultTime,
    storagePath,
    recordCount,
  } = doc.data();
  const randomWorkout: RandomWorkout = {
    id: doc.id,
    uid: uid || '',
    cues: cues || [],
    title: title || '',
    cueIds: cueIds || [],
    targetBpm: targetBpm || 0,
    resultBpm: resultBpm || 0,
    createdAt: createdAt || 0,
    beatCount: beatCount || 0,
    roundCount: roundCount || 0,
    resultTime: resultTime || 0,
    storagePath: storagePath || '',
    recordCount: recordCount || 0,
  };
  return randomWorkout;
};

export const cuesToCuesStr = (cues: RandomWorkoutCue[]): string => {
  let lines: string[] = [];
  for (const cue of cues) {
    const { label, pitchStr } = cue;
    lines.push(label);
    lines.push(pitchStr);
  }
  return lines.join('\n');
};

export const cuesStrToCues = (
  cuesStr: string,
  cues: RandomWorkoutCue[]
): RandomWorkoutCue[] => {
  const labels: string[] = [];
  const pitchStrs: string[] = [];

  const lines = cuesStr.split('\n');
  lines.forEach((line, index) => {
    if (index % 2) {
      pitchStrs.push(line);
    } else {
      labels.push(line);
    }
  });
  return labels.map((label, index) => ({
    id: nanoid(4),
    label,
    pitchStr: pitchStrs[index] || '',
    imagePath: cues[index]?.imagePath || '',
  }));
};

export const calcBeatCount = (cues: RandomWorkoutCue[]): number => {
  let beatCount = 0;
  for (const cue of cues) {
    const { pitchStr } = cue;
    const pitchesArray = string2PitchesArray(pitchStr);
    for (const wordPich of pitchesArray) {
      beatCount += wordPich.length / 2;
    }
  }
  return Math.ceil(beatCount);
};
