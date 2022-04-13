import { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../../../../services/app';
import { OndokuSentence } from '../../../../services/useOndokuSentences';

export const useOndokuPage = (id: string) => {
  const navigate = useNavigate();
  const { ondoku, setOndokuSentenceId, ondokuSentences } =
    useContext(AppContext);

  const [title, setTitle] = useState('');

  useEffect(() => {
    setTitle(ondoku.title);
  }, [ondoku]);

  const onEdit = (ondokuSentence: OndokuSentence) => {
    setOndokuSentenceId(ondokuSentence.id);
    navigate(`/ondoku/sentence/${ondokuSentence.id}`);
  };

  return {
    title,
    onEdit,
    ondoku,
    initializing: false,
    ondokuSentences,
  };
};
