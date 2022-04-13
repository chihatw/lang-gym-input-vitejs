import { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { OndokuSentence } from '../../../../entities/OndokuSentence';
import { getOndokuSentences } from '../../../../repositories/ondokuSentence';
import { AppContext } from '../../../../services/app';

export const useOndokuPage = (id: string) => {
  const navigate = useNavigate();
  const { ondoku } = useContext(AppContext);
  // const [ondoku, setOndoku] = useState<Ondoku | null>(null);
  const [initializing, setInitializing] = useState(true);
  const [ondokuSentences, setOndokuSentences] = useState<OndokuSentence[]>([]);
  const [title, setTitle] = useState('');

  useEffect(() => {
    setTitle(ondoku.title);
  }, [ondoku]);

  useEffect(() => {
    if (!ondoku) return;
    const fetchData = async () => {
      const ondokuSentences = await getOndokuSentences(ondoku.id);
      !!ondokuSentences && setOndokuSentences(ondokuSentences);
      setInitializing(false);
    };
    fetchData();
  }, [ondoku, navigate, id]);

  const onEdit = (ondokuSentence: OndokuSentence) =>
    navigate(`/ondoku/sentence/${ondokuSentence.id}`);

  return {
    title,
    onEdit,
    ondoku,
    initializing,
    ondokuSentences,
  };
};
