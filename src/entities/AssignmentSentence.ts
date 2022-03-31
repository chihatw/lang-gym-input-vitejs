import { DocumentData } from '@firebase/firestore';
import { Accent } from './Accent';

export type AssignmentSentence = {
  id: string;
  accents: Accent[];
  article: string;
  end: number;
  line: number;
  mistakes: string[];
  ondoku: string;
  start: number;
  uid: string;
};

export type CreateAssignmentSentence = Omit<AssignmentSentence, 'id'>;

export const buildAssignmentSentence = (id: string, data: DocumentData) => {
  const assignmentSentence: AssignmentSentence = {
    id,
    accents: data.accents,
    article: data.article,
    end: data.end,
    line: data.line,
    mistakes: data.mistakes,
    ondoku: data.ondoku,
    start: data.start,
    uid: data.uid,
  };
  return assignmentSentence;
};
