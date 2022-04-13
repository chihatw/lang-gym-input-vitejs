import { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { buildAccents, buildAccentString } from '../../../../entities/Accent';
import { AppContext } from '../../../../services/app';
import {
  OndokuSentence,
  useHandleOndokuSentences,
} from '../../../../services/useOndokuSentences';

export const useEditOndokuSentencePage = (id: string) => {
  const navigate = useNavigate();
  const { ondoku, ondokuSentence } = useContext(AppContext);
  const { updateOndokuSentence } = useHandleOndokuSentences();
  const [title, setTitle] = useState('');
  const [downloadURL, setDownloadURL] = useState('');
  const [ondokuID, setOndokuID] = useState('');
  const [japanese, setJapanese] = useState('');
  const [accentString, setAccentString] = useState('');
  const [start, setStart] = useState(0);
  const [end, setEnd] = useState(0);

  useEffect(() => {
    if (!id) return;
    setOndokuID(ondokuSentence.ondoku);
    setJapanese(ondokuSentence.japanese);
    setStart(ondokuSentence.start);
    setEnd(ondokuSentence.end);
    setAccentString(buildAccentString(ondokuSentence.accents));
  }, [id, ondokuSentence]);

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
    const newOndokuSentence: OndokuSentence = {
      ...ondokuSentence,
      accents: buildAccents(accentString),
      start,
      end,
      japanese,
    };
    const result = await updateOndokuSentence(newOndokuSentence);
    if (!!result) {
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
