import { getDownloadURL } from '@firebase/storage';
import { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { uploadFile } from '../../../../repositories/file';
import { AppContext } from '../../../../services/app';
import { Ondoku, useHandleOndokus } from '../../../../services/useOndokus';

export const useInitialOndokuVoicePage = (id: string) => {
  const navigate = useNavigate();

  const { updateOndoku } = useHandleOndokus();
  const { ondoku, ondokuSentences } = useContext(AppContext);
  const [title, setTitle] = useState('');
  const [hasSentences, setHasSentences] = useState(false);

  useEffect(() => {
    if (!ondoku.id) return;
    setTitle(ondoku.title);
    setHasSentences(!!ondokuSentences.length);
  }, [ondoku, ondokuSentences]);

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

  return { title, initializing: false, onUpload, hasSentences };
};
