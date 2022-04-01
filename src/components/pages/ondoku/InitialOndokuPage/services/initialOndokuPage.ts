import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { buildAccents } from '../../../../../entities/Accent';
import { CreateOndokuSentence } from '../../../../../entities/OndokuSentence';
import { getOndoku } from '../../../../../repositories/ondoku';
import { createOndokuSentences } from '../../../../../repositories/ondokuSentence';

export const useInitialOndokuPage = (id: string) => {
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [japanese, setJapanese] = useState('');
  const [accentString, setAccentString] = useState('');
  const [ondokuSentences, setOndokuSentences] = useState<
    CreateOndokuSentence[]
  >([]);
  const [isValid, setIsValid] = useState(false);
  useEffect(() => {
    const fetchData = async () => {
      const ondoku = await getOndoku(id);
      if (!!ondoku) {
        setTitle(ondoku.title);
      }
    };
    fetchData();
  }, [id]);
  const onChangeJapanese = (japanese: string) => {
    setJapanese(japanese);
  };

  const onChangeAccentString = (accentString: string) => {
    setAccentString(accentString);
  };

  useEffect(() => {
    const accentsArray = accentString
      .split('\n')
      .filter((i) => i)
      .map((s) => buildAccents(s));
    setOndokuSentences(
      japanese
        .split('\n')
        .filter((i) => i)
        .map((j, index) => ({
          accents: !!accentsArray[index] ? accentsArray[index] : [],
          createdAt: new Date().getTime(),
          end: 0,
          japanese: j,
          line: index,
          ondoku: id,
          start: 0,
        }))
    );

    setIsValid(
      !!japanese &&
        japanese.split('\n').filter((i) => i).length ===
          accentString.split('\n').filter((i) => i).length
    );
  }, [japanese, accentString, id]);

  const onSubmit = async () => {
    const { success } = await createOndokuSentences(ondokuSentences);
    if (success) {
      navigate(`/ondoku/list`);
    }
  };

  return {
    title,
    japanese,
    accentString,
    onChangeJapanese,
    onChangeAccentString,
    ondokuSentences,
    onSubmit,
    isValid,
  };
};
