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

const useAudioItems = () => {
  const [audioItems, setAudioItems] = useState<AudioItem[]>([]);

  useEffect(() => {
    const unsub = db.collection(COLLECTION).onSnapshot(
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
      db.collection(COLLECTION).doc(id).delete();
    }
  };

  return { audioItems, deleteAudioItem };
};

export default useAudioItems;
