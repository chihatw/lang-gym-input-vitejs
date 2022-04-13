import { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mark } from '../../../../entities/Mark';
import { OndokuSentence } from '../../../../entities/OndokuSentence';
import { deleteFile } from '../../../../repositories/file';
import {
  getOndokuSentences,
  updateOndokuSentences,
} from '../../../../repositories/ondokuSentence';
import { AppContext } from '../../../../services/app';
import { Ondoku, useHandleOndokus } from '../../../../services/useOndokus';

export const useEditOndokuVoicePage = (id: string) => {
  const navigate = useNavigate();

  const { ondoku } = useContext(AppContext);

  const { updateOndoku } = useHandleOndokus();
  const [title, setTitle] = useState('');
  const [downloadURL, setDownloadURL] = useState('');
  const [initializing, setInitializing] = useState(true);
  const [marks, setMarks] = useState<Mark[]>([]);
  const [sentences, setSentences] = useState<string[]>([]);
  const [originalOndoku, setOriginalOndoku] = useState<Ondoku | null>(null);
  const [originalMarks, setOriginalMarks] = useState<Mark[]>([]);
  const [originalSentences, setOriginalSentences] = useState<OndokuSentence[]>(
    []
  );
  const [hasChange, setHasChange] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setTitle(ondoku.title);
      setDownloadURL(ondoku.downloadURL);
      setOriginalOndoku(ondoku);
      const ondokuSentences = await getOndokuSentences(id);
      if (ondokuSentences) {
        setMarks(ondokuSentences.map((s) => ({ start: s.start, end: s.end })));
        setSentences(ondokuSentences.map((s) => s.japanese));
        setOriginalMarks(
          ondokuSentences.map((s) => ({ start: s.start, end: s.end }))
        );
        setOriginalSentences(ondokuSentences);
      }

      setInitializing(false);
    };
    fetchData();
  }, [ondoku]);

  useEffect(() => {
    setHasChange(JSON.stringify(marks) !== JSON.stringify(originalMarks));
  }, [originalMarks, marks]);

  const onDeleteAudio = async () => {
    if (window.confirm('audioファイルを削除しますか')) {
      const path = decodeURIComponent(downloadURL.split('/')[7].split('?')[0]);
      const { success } = await deleteFile(path);
      if (success) {
        const sentences: OndokuSentence[] = originalSentences.map((s) => ({
          ...s,
          start: 0,
          end: 0,
        }));
        const { success } = await updateOndokuSentences(sentences);
        if (success) {
          const ondoku: Ondoku = { ...originalOndoku!, downloadURL: '' };
          const result = await updateOndoku(ondoku);
          if (!!result) {
            navigate('/ondoku/list');
          }
        }
      }
    }
  };

  const onChangeMarks = (marks: Mark[]) => {
    setMarks(marks);
  };

  const onSubmit = async () => {
    const sentences: OndokuSentence[] = originalSentences.map((s, index) => ({
      ...s,
      start: marks[index].start,
      end: marks[index].end,
    }));
    const { success } = await updateOndokuSentences(sentences);
    if (success) {
      navigate(`ondoku/${id}`);
    }
  };

  return {
    title,
    initializing,
    downloadURL,
    marks,
    sentences,
    onDeleteAudio,
    onChangeMarks,
    hasChange,
    onSubmit,
  };
};
