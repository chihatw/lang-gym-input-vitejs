import {
  collection,
  deleteDoc,
  doc,
  DocumentData,
  getDocs,
  limit,
  orderBy,
  query,
  setDoc,
} from 'firebase/firestore';
import { WorkingMemory } from '../Model';
import { WorkingMemoryFormState } from '../pages/WorkingMemory/WorkingMemoryEditPage/Model';
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
    orderBy('createdAt', 'desc'),
    limit(10)
  );
  console.log('get workingMemories');
  const querySnapshot = await getDocs(q);
  querySnapshot.forEach((doc) => {
    workingMemories[doc.id] = buildWorkingMemory(doc);
  });
  return workingMemories;
};

export const setWorkingMemory = (workingMemory: WorkingMemory) => {
  console.log('set WorkingMemory');
  const { id, ...omitted } = workingMemory;
  setDoc(doc(db, COLLECTIONS.workingMemories, id), { ...omitted });
};

export const deleteWorkingMemory = (id: string) => {
  console.log('delete WorkingMemory');
  deleteDoc(doc(db, COLLECTIONS.workingMemories, id));
};

export const buildWorkingMemoryFormState = (
  workingMemory: WorkingMemory
): WorkingMemoryFormState => {
  return {
    id: workingMemory.id,
    baseCueCount: workingMemory.baseCueCount,
    cueIdsStr: workingMemory.cueIds.join('\n'),
    isActive: workingMemory.isActive,
    offset: workingMemory.offset,
    step: workingMemory.step,
    title: workingMemory.title,
    uid: workingMemory.uid,
  };
};

const buildWorkingMemory = (doc: DocumentData): WorkingMemory => {
  const {
    uid,
    logs,
    step,
    title,
    cueIds,
    offset,
    isActive,
    createdAt,
    baseCueCount,
  } = doc.data();
  return {
    id: doc.id,
    uid: uid || '',
    logs: logs || {},
    step: step || 0,
    title: title || '',
    cueIds: cueIds || [],
    offset: offset || 0,
    isActive: isActive || false,
    createdAt: createdAt || 0,
    baseCueCount: baseCueCount || 0,
  };
};
