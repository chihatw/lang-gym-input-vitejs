import {
  doc,
  query,
  where,
  getDoc,
  getDocs,
  orderBy,
  deleteDoc,
  collection,
  DocumentData,
  updateDoc,
  onSnapshot,
  Unsubscribe,
} from '@firebase/firestore';
import { useEffect, useState } from 'react';
import { Accent } from '../entities/Accent';
import { db } from '../repositories/firebase';

export type OndokuSentence = {
  id: string;
  end: number;
  line: number;
  start: number;
  ondoku: string;
  accents: Accent[];
  japanese: string;
  createdAt: number;
};

export const INITIAL_ONDOKU_SENTENCE: OndokuSentence = {
  id: '',
  end: 0,
  line: 0,
  start: 0,
  ondoku: '',
  accents: [],
  japanese: '',
  createdAt: 0,
};

const COLLECTION = 'oSentences';
const colRef = collection(db, COLLECTION);

export const useOndokuSentences = ({
  ondokuId,
  ondokuSentenceId,
}: {
  ondokuId: string;
  ondokuSentenceId: string;
}) => {
  const [ondokuSentence, setOndokuSentence] = useState(INITIAL_ONDOKU_SENTENCE);
  const [ondokuSentences, setOndokuSentences] = useState<OndokuSentence[]>([]);

  useEffect(() => {
    let unsub: Unsubscribe | null = null;
    if (!ondokuSentenceId) {
      setOndokuSentence(INITIAL_ONDOKU_SENTENCE);
    } else {
      const ondokuSentenceIds = ondokuSentences.map((sentence) => sentence.id);
      if (ondokuSentenceIds.includes(ondokuSentenceId)) {
        const ondokuSentence = ondokuSentences.filter(
          (sentence) => sentence.id === ondokuSentenceId
        )[0];
        setOndokuSentence(ondokuSentence);
      } else {
        unsub = onSnapshot(
          doc(db, COLLECTION, ondokuSentenceId),
          (doc) => {
            console.log('snapshot ondokuSentence');
            if (doc.exists()) {
              const ondokuSentence = buildOndokuSentence(doc);
              setOndokuSentence(ondokuSentence);
            } else {
              setOndokuSentence(INITIAL_ONDOKU_SENTENCE);
            }
          },
          (e) => {
            console.warn(e);
            !!unsub && unsub();
          }
        );
      }
    }
    return () => {
      !!unsub && unsub();
    };
  }, [ondokuSentenceId]);

  useEffect(() => {
    let unsub: Unsubscribe | null = null;
    if (!ondokuId) {
      setOndokuSentences([]);
    } else {
      const q = query(colRef, where('ondoku', '==', ondokuId), orderBy('line'));
      unsub = onSnapshot(
        q,
        (snapshot) => {
          console.log('snapshot ondokuSentences');
          const ondokuSentences: OndokuSentence[] = [];
          snapshot.forEach((doc) => {
            const ondokuSentence = buildOndokuSentence(doc);
            ondokuSentences.push(ondokuSentence);
          });
          setOndokuSentences(ondokuSentences);
        },
        (e) => {
          console.warn(e);
          setOndokuSentences([]);
          !!unsub && unsub();
        }
      );
    }
    return () => {
      !!unsub && unsub();
    };
  }, [ondokuId]);

  return { ondokuSentence, ondokuSentences };
};

export const useHandleOndokuSentences = () => {
  const updateOndokuSentence = ({
    ondokuSentence,
    callback,
  }: {
    ondokuSentence: OndokuSentence;
    callback?: () => void;
  }) => {
    const { id, ...omitted } = ondokuSentence;
    console.log('update ondoku sentence');
    updateDoc(doc(db, COLLECTION, id), { ...omitted })
      .then(() => {
        !!callback && callback();
      })
      .catch((e) => console.warn(e));
  };

  const deleteOndokuSentences = async (ondokuId: string) => {
    const q = query(colRef, where('ondoku', '==', ondokuId));
    const snapshot = await getDocs(q);
    snapshot.forEach((doc) => {
      console.log('delete ondoku sentences');
      deleteDoc(doc.ref);
    });
  };
  return { deleteOndokuSentences, updateOndokuSentence };
};

const buildOndokuSentence = (doc: DocumentData): OndokuSentence => {
  return {
    id: doc.id,
    end: doc.data().end,
    line: doc.data().line,
    start: doc.data().start,
    ondoku: doc.data().ondoku,
    accents: doc.data().accents,
    japanese: doc.data().japanese,
    createdAt: doc.data().createdAt,
  };
};
