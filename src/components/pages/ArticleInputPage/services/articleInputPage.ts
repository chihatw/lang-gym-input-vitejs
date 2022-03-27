import { createContext, useEffect, useState } from 'react';

export const ArticleInputPageContext = createContext<{
  chinese: string[];
  original: string[];
  corrected: string[];
  setChinese: React.Dispatch<React.SetStateAction<string[]>>;
  setOriginal: React.Dispatch<React.SetStateAction<string[]>>;
  setCorrected: React.Dispatch<React.SetStateAction<string[]>>;
}>({
  chinese: [],
  original: [],
  corrected: [],
  setChinese: () => {},
  setOriginal: () => {},
  setCorrected: () => {},
});

export const useArticleInputPage = () => {
  const [input, setInput] = useState('');
  const [original, setOriginal] = useState<string[]>([]);
  const [chinese, setChinese] = useState<string[]>([]);
  const [corrected, setCorrected] = useState<string[]>([]);

  useEffect(() => {
    const separatedByBlankLine: string[] = input.split('\n').filter((i) => i);
    const original = separatedByBlankLine.filter((_, index) => index % 2 === 0);
    const chinese = separatedByBlankLine.filter((_, index) => index % 2 === 1);
    setOriginal(original);
    setChinese(chinese);
  }, [input]);

  useEffect(() => {
    setCorrected(original);
  }, [original]);

  const items: {
    label: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  }[] = [
    {
      label: '1対1',
      value: input,
      onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) =>
        setInput(e.target.value),
    },
    {
      label: 'Original',
      value: original.join('\n'),
      onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) =>
        setOriginal(e.target.value.split('\n')),
    },
    {
      label: 'Chinese',
      value: chinese.join('\n'),
      onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) =>
        setChinese(e.target.value.split('\n')),
    },
  ];

  return {
    input,
    setInput,
    original,
    setOriginal,
    chinese,
    setChinese,
    corrected,
    setCorrected,
    items,
  };
};
