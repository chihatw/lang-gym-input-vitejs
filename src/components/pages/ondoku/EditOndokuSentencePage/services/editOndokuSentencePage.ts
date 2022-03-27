import { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import {
  buildAccents,
  buildAccentString,
} from '../../../../../entities/Accent';
import { UpdateOndokuSentence } from '../../../../../entities/OndokuSentence';
import { getOndoku } from '../../../../../repositories/ondoku';
import {
  getOndokuSentence,
  updateOndokuSentence,
} from '../../../../../repositories/ondokuSentence';

export const useEditOndokuSentencePage = (id: string) => {
  const history = useHistory();
  const [title, setTitle] = useState('');
  const [downloadURL, setDownloadURL] = useState('');
  const [ondokuID, setOndokuID] = useState('');
  const [japanese, setJapanese] = useState('');
  const [accentString, setAccentString] = useState('');
  const [start, setStart] = useState(0);
  const [end, setEnd] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      if (!id) return;
      const ondokuSentence = await getOndokuSentence(id);
      if (!!ondokuSentence) {
        setOndokuID(ondokuSentence.ondoku);
        setJapanese(ondokuSentence.japanese);
        setStart(ondokuSentence.start);
        setEnd(ondokuSentence.end);
        setAccentString(buildAccentString(ondokuSentence.accents));
      }
    };
    fetchData();
  }, [id]);

  useEffect(() => {
    if (!ondokuID) return;
    const fetchData = async () => {
      const ondoku = await getOndoku(ondokuID);
      if (!!ondoku) {
        setTitle(ondoku.title);
        setDownloadURL(ondoku.downloadURL);
      }
    };
    fetchData();
  }, [ondokuID]);
  const onChangeJapanese = (japanese: string) => {
    setJapanese(japanese);
  };
  const onChangeAccentString = (accentString: string) => {
    setAccentString(accentString);
  };
  const onChangeStart = (start: number) => {
    setStart(start);
  };
  const onChangeEnd = (end: number) => {
    setEnd(end);
  };
  const onSubmit = async () => {
    const newOndokuSentence: UpdateOndokuSentence = {
      accents: buildAccents(accentString),
      start,
      end,
      japanese,
    };
    const { success } = await updateOndokuSentence(id, newOndokuSentence);
    if (success) {
      history.push(`/ondoku/${ondokuID}`);
    }
  };
  return {
    title,
    ondokuID,
    japanese,
    onChangeJapanese,
    accentString,
    onChangeAccentString,
    start,
    onChangeStart,
    end,
    onChangeEnd,
    downloadURL,
    onSubmit,
  };
};
