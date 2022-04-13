import { getDownloadURL } from '@firebase/storage';
import { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { uploadFile } from '../../../../repositories/file';
import { getOndokuSentences } from '../../../../repositories/ondokuSentence';
import { AppContext } from '../../../../services/app';
import { Ondoku, useHandleOndokus } from '../../../../services/useOndokus';

export const useInitialOndokuVoicePage = (id: string) => {
  const navigate = useNavigate();

  const { updateOndoku } = useHandleOndokus();
  const { ondoku } = useContext(AppContext);
  const [title, setTitle] = useState('');
  const [initializing, setInitializing] = useState(true);
  const [hasSentences, setHasSentences] = useState(false);

  useEffect(() => {
    if (!ondoku.id) return;
    const fetchData = async () => {
      setTitle(ondoku.title);

      const ondokuSentences = await getOndokuSentences(id);
      if (!!ondokuSentences) {
        setHasSentences(!!ondokuSentences.length);
      }
      setInitializing(false);
    };
    fetchData();
  }, [ondoku]);

  const onUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const file = e.target.files[0];
    const { success, snapshot } = await uploadFile(file, 'ondokus');
    if (!!success && !!snapshot) {
      const url = await getDownloadURL(snapshot.ref);
      const newOndoku: Ondoku = {
        ...ondoku!,
        downloadURL: url,
      };
      const result = await updateOndoku(newOndoku);
      if (!!result) {
        navigate(`/ondoku/${id}/voice`);
      }
    }
  };

  return { title, initializing, onUpload, hasSentences };
};
