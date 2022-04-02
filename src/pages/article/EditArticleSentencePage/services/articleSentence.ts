import { useEffect, useState } from 'react';
import { Sentence } from '../../../../entities/Sentence';
import { getSentence } from '../../../../repositories/sentence';

export const useArticleSentence = ({ id }: { id: string }) => {
  const [sentence, setSentence] = useState<Sentence | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!id) return;
      const sentence = await getSentence(id);
      if (!!sentence) {
        setSentence(sentence);
      }
    };
    fetchData();
  }, [id]);

  return {
    sentence,
  };
};
