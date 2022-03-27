import { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { Ondoku } from '../../../../../entities/Ondoku';
import { OndokuSentence } from '../../../../../entities/OndokuSentence';
import { getOndoku } from '../../../../../repositories/ondoku';
import { getOndokuSentences } from '../../../../../repositories/ondokuSentence';

export const useOndokuPage = (id: string) => {
  const history = useHistory();
  const [ondoku, setOndoku] = useState<Ondoku | null>(null);
  const [initializing, setInitializing] = useState(true);
  const [ondokuSentences, setOndokuSentences] = useState<OndokuSentence[]>([]);
  const [title, setTitle] = useState('');

  useEffect(() => {
    if (!id) return;
    const fetchData = async () => {
      const ondoku = await getOndoku(id);
      if (!!ondoku) {
        setTitle(ondoku.title);
        setOndoku(ondoku);
      }
    };
    fetchData();
  }, [id]);

  useEffect(() => {
    if (!ondoku) return;
    const fetchData = async () => {
      const ondokuSentences = await getOndokuSentences(ondoku.id);
      !!ondokuSentences && setOndokuSentences(ondokuSentences);
      setInitializing(false);
    };
    fetchData();
  }, [ondoku, history, id]);

  const onEdit = (ondokuSentence: OndokuSentence) =>
    history.push(`/ondoku/sentence/${ondokuSentence.id}`);

  return {
    title,
    onEdit,
    ondoku,
    initializing,
    ondokuSentences,
  };
};
