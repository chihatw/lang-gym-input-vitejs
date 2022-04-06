import { DocumentData } from '@firebase/firestore';
import { Assignment } from '../services/useAssignments';

export type CreateAssignment = Omit<Assignment, 'id'>;

export const buildAssignment = (id: string, data: DocumentData) => {
  const assignment: Assignment = {
    id,
    article: data.article,
    downloadURL: data.downloadURL,
    ondoku: data.ondoku,
    uid: data.uid,
  };
  return assignment;
};
