import { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { buildAccents, buildAccentString } from '../../../../entities/Accent';
import { UpdateOndokuSentence } from '../../../../entities/OndokuSentence';
import {
  getOndokuSentence,
  updateOndokuSentence,
} from '../../../../repositories/ondokuSentence';
import { AppContext } from '../../../../services/app';

export const useEditOndokuSentencePage = (id: string) => {
  const navigate = useNavigate();
  const { ondoku } = useContext(AppContext);

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
    setTitle(ondoku.title);
    setDownloadURL(ondoku.downloadURL);
  }, [ondoku]);
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
      navigate(`/ondoku/${ondokuID}`);
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
