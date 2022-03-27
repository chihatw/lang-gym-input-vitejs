import { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { Mark } from '../../../../../entities/Mark';
import { Ondoku } from '../../../../../entities/Ondoku';
import { OndokuSentence } from '../../../../../entities/OndokuSentence';
import { deleteFile } from '../../../../../repositories/file';
import { getOndoku, updateOndoku } from '../../../../../repositories/ondoku';
import {
  getOndokuSentences,
  updateOndokuSentences,
} from '../../../../../repositories/ondokuSentence';

export const useEditOndokuVoicePage = (id: string) => {
  const history = useHistory();
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
      const ondoku = await getOndoku(id);
      if (!!ondoku) {
        setTitle(ondoku.title);
        setDownloadURL(ondoku.downloadURL);
        setOriginalOndoku(ondoku);
        const ondokuSentences = await getOndokuSentences(id);
        if (ondokuSentences) {
          setMarks(
            ondokuSentences.map((s) => ({ start: s.start, end: s.end }))
          );
          setSentences(ondokuSentences.map((s) => s.japanese));
          setOriginalMarks(
            ondokuSentences.map((s) => ({ start: s.start, end: s.end }))
          );
          setOriginalSentences(ondokuSentences);
        }
      }
      setInitializing(false);
    };
    fetchData();
  }, [id]);

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
          const { success } = await updateOndoku(ondoku);
          if (success) {
            history.push('/ondoku/list');
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
      history.push(`ondoku/${id}`);
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
