import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { buildAccents, buildAccentString } from '../../../../entities/Accent';
import { Sentence } from '../../../../entities/Sentence';
import { buildTags } from '../../../../entities/Tags';
import { updateSentence } from '../../../../repositories/sentence';

export const useArticleSentenceForm = (
  articleID: string,
  sentence: Sentence
) => {
  const navigate = useNavigate();

  const [japanese, setJapanese] = useState(sentence.japanese);
  const [original, setOriginal] = useState(sentence.original);
  const [chinese, setChinese] = useState(sentence.chinese);
  const [kana, setKana] = useState(sentence.kana);
  const [accentString, setAccentString] = useState(
    buildAccentString(sentence.accents)
  );
  const [start, setStart] = useState(sentence.start);
  const [end, setEnd] = useState(sentence.end);

  const onChangeJapanese = (japanese: string) => {
    setJapanese(japanese);
  };
  const onChangeOriginal = (original: string) => {
    setOriginal(original);
  };
  const onChangeChinese = (chinese: string) => {
    setChinese(chinese);
  };
  const onChangeKana = (kana: string) => {
    setKana(kana);
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
    const newSentence: Sentence = {
      ...sentence,
      accents: buildAccents(accentString),
      chinese,
      end,
      japanese,
      kana,
      original,
      start,
      tags: buildTags([japanese, original, chinese, kana]),
    };
    const { success } = await updateSentence(newSentence);
    if (success) {
      navigate(`/article/${articleID}`);
    }
  };
  const items: {
    label: string;
    value: string | number;
    onChange: React.ChangeEventHandler<HTMLTextAreaElement | HTMLInputElement>;
    rows?: number;
    type?: string;
    multiline?: boolean;
  }[] = [
    {
      label: 'japanese',
      value: japanese,
      onChange: (e) => onChangeJapanese(e.target.value),
    },
    {
      label: 'original',
      value: original,
      onChange: (e) => onChangeOriginal(e.target.value),
    },
    {
      label: 'chinese',
      value: chinese,
      onChange: (e) => onChangeChinese(e.target.value),
    },
    {
      label: 'kana',
      value: kana,
      onChange: (e) => onChangeKana(e.target.value),
    },
    {
      label: 'accents',
      value: accentString,
      onChange: (e) => onChangeAccentString(e.target.value),
      multiline: true,
      rows: 5,
    },
    {
      label: 'start',
      value: start,
      type: 'number',
      onChange: (e) => onChangeStart(Number(e.target.value)),
    },
    {
      label: 'end',
      value: end,
      type: 'number',
      onChange: (e) => onChangeEnd(Number(e.target.value)),
    },
  ];
  return {
    end,
    items,
    start,
    onSubmit,
    accentString,
  };
};
