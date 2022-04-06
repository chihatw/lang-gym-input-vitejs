import { collection, getDocs, query, where } from '@firebase/firestore';
import { buildAssignment } from '../entities/Assignment';
import { db } from './firebase';

const COLLECTION = 'assignments';

const assignmentsRef = collection(db, COLLECTION);

export const getAssignment = async ({
  uid,
  articleID,
  ondokuID,
}: {
  uid: string;
  articleID?: string;
  ondokuID?: string;
}) => {
  try {
    let q = !!articleID
      ? query(assignmentsRef, where('article', '==', articleID))
      : query(assignmentsRef, where('ondoku', '==', ondokuID));

    q = query(q, where('uid', '==', uid));
    console.log('get assignment');
    const snapshot = await getDocs(q);
    const doc = snapshot.docs[0];
    return buildAssignment(doc.id, doc.data());
  } catch (e) {
    console.warn(e);
    return null;
  }
};
