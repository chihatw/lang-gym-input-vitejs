import { useEffect, useState } from 'react';
import { useHistory } from 'react-router';
import { Ondoku } from '../../../../../entities/Ondoku';
import { uploadFile } from '../../../../../repositories/file';
import { getOndoku, updateOndoku } from '../../../../../repositories/ondoku';
import { getOndokuSentences } from '../../../../../repositories/ondokuSentence';

export const useInitialOndokuVoicePage = (id: string) => {
  const history = useHistory();
  const [title, setTitle] = useState('');
  const [initializing, setInitializing] = useState(true);
  const [ondoku, setOndoku] = useState<Ondoku | null>(null);
  const [hasSentences, setHasSentences] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      const ondoku = await getOndoku(id);
      if (!!ondoku) {
        setTitle(ondoku.title);
        setOndoku(ondoku);
      }
      const ondokuSentences = await getOndokuSentences(id);
      if (!!ondokuSentences) {
        setHasSentences(!!ondokuSentences.length);
      }
      setInitializing(false);
    };
    fetchData();
  }, [id]);

  const onUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const file = e.target.files[0];
    const { success, snapshot } = await uploadFile(file, 'ondokus');
    if (!!success && !!snapshot) {
      const url = await snapshot.ref.getDownloadURL();
      const newOndoku: Ondoku = {
        ...ondoku!,
        downloadURL: url,
      };
      const { success } = await updateOndoku(newOndoku);
      if (success) {
        history.push(`/ondoku/${id}/voice`);
      }
    }
  };

  return { title, initializing, onUpload, hasSentences };
};
