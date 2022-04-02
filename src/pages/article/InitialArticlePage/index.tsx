import { useNavigate } from 'react-router-dom';
import React, { useContext, useEffect, useState } from 'react';

import { buildTags } from '../../../entities/Tags';
import { AppContext } from '../../../services/app';
import { Accent, buildAccents } from '../../../entities/Accent';
import { CreateSentence } from '../../../entities/Sentence';
import { createSentences } from '../../../repositories/sentence';
import InitialArticlePageComponent from './components/InitialArticlePageComponent';

// create ArticlePage の後
const InitialArticlePage = () => {
  const navigate = useNavigate();
  const { article, isFetching } = useContext(AppContext);

  const [isValid, setIsValid] = useState(false);
  const [kanaArray, setKanaArray] = useState<string[]>([]);
  const [chineseArray, setChineseArray] = useState<string[]>([]);
  const [accentsArray, setAccentsArray] = useState<Accent[][]>([]);
  const [originalArray, setOriginalArray] = useState<string[]>([]);
  const [japaneseArray, setJapaneseArray] = useState<string[]>([]);

  const handleChangeJapanese = (value: string) => {
    const lines = value.split('\n').filter((i) => i);
    setJapaneseArray(lines);
  };

  const handleChangeOriginal = (value: string) => {
    const lines = value.split('\n').filter((i) => i);
    setOriginalArray(lines);
  };

  const handleChangeKana = (value: string) => {
    const lines = value.split('\n').filter((i) => i);
    setKanaArray(lines);
  };

  const handleChangeAccentString = (value: string) => {
    const accentsArray = value
      .split('\n')
      .filter((i) => i)
      .map((s) => buildAccents(s));
    setAccentsArray(accentsArray);
  };

  const handleChangeChinese = (value: string) => {
    const lines = value.split('\n').filter((i) => i);
    setChineseArray(lines);
  };
  useEffect(() => {
    setIsValid(
      japaneseArray.length === accentsArray.length &&
        japaneseArray.length === originalArray.length &&
        japaneseArray.length === kanaArray.length &&
        japaneseArray.length === chineseArray.length
    );
  }, [
    japaneseArray,
    accentsArray,
    originalArray,
    kanaArray,
    chineseArray,
    article,
  ]);

  const onSubmit = async () => {
    const sentences: CreateSentence[] = [];
    japaneseArray.forEach((_, index) => {
      const sentence: CreateSentence = {
        end: 0,
        uid: article.uid,
        line: index,
        kana: kanaArray[index] || '',
        start: 0,
        article: article.id,
        japanese: japaneseArray[index],
        chinese: chineseArray[index] || '',
        accents: accentsArray[index] || [],
        createdAt: new Date().getTime(),
        original: originalArray[index] || '',
        tags: buildTags([
          japaneseArray[index],
          chineseArray[index] || '',
          kanaArray[index] || '',
          originalArray[index] || '',
        ]),
        title: article.title,
      };
      sentences.push(sentence);
    });

    const { success } = await createSentences(sentences);
    if (success) {
      navigate(`/article/${article.id}`);
    }
  };

  if (isFetching) {
    return <></>;
  } else {
    return (
      <InitialArticlePageComponent
        article={article}
        isValid={isValid}
        accentsArray={accentsArray}
        japaneseArray={japaneseArray}
        onSubmit={onSubmit}
        handleChangeKana={handleChangeKana}
        handleChangeChinese={handleChangeChinese}
        handleChangeOriginal={handleChangeOriginal}
        handleChangeJapanese={handleChangeJapanese}
        handleChangeAccentString={handleChangeAccentString}
      />
    );
  }
};

export default InitialArticlePage;
