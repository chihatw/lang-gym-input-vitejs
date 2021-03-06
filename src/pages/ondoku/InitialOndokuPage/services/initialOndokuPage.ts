import { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { buildAccents } from '../../../../entities/Accent';

import { AppContext } from '../../../../services/app';
import {
  OndokuSentence,
  useHandleOndokuSentences,
} from '../../../../services/useOndokuSentences';

export const useInitialOndokuPage = (id: string) => {
  const navigate = useNavigate();
  const { ondoku } = useContext(AppContext);
  const { addOndokuSentences } = useHandleOndokuSentences();
  const [title, setTitle] = useState('');
  const [japanese, setJapanese] = useState('');
  const [accentString, setAccentString] = useState('');
  const [ondokuSentences, setOndokuSentences] = useState<
    Omit<OndokuSentence, 'id'>[]
  >([]);
  const [isValid, setIsValid] = useState(false);
  useEffect(() => {
    setTitle(ondoku.title);
  }, [ondoku]);
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
    const ids = await addOndokuSentences(ondokuSentences);
    if (!!ids.length) {
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
