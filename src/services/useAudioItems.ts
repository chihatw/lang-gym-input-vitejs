import { collection, onSnapshot, deleteDoc, doc } from '@firebase/firestore';
import { useEffect, useState } from 'react';
import { db } from '../repositories/firebase';

export type AudioItem = {
  id: string;
  uid: string;
  bpm: number;
  dateId: string;
  dataURI: string;
  workoutId: string;
  isPerfect: boolean;
  isDeleted: boolean;
};

const COLLECTION = 'audioItems';
const colRef = collection(db, COLLECTION);

const useAudioItems = () => {
  const [audioItems, setAudioItems] = useState<AudioItem[]>([]);

  useEffect(() => {
    const unsub = onSnapshot(
      colRef,
      (snapshot) => {
        const audioItems: AudioItem[] = [];
        snapshot.forEach((doc) => {
          audioItems.push(doc.data() as AudioItem);
        });
        setAudioItems(audioItems);
      },
      (error) => {
        console.warn(error);
      }
    );
    return () => unsub();
  }, []);

  const deleteAudioItem = (id: string) => {
    if (window.confirm('delete?')) {
      deleteDoc(doc(db, COLLECTION, id));
    }
  };

  return { audioItems, deleteAudioItem };
};

export default useAudioItems;
