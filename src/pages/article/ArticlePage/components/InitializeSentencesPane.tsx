import React, { useState } from 'react';
import string2PitchesArray from 'string2pitches-array';
import { SentencePitchLine } from '@chihatw/pitch-line.sentence-pitch-line';
import { Button, TextField } from '@mui/material';

import { Article } from '../../../../services/useArticles';
import { Sentence } from '../../../../entities/Sentence';
import { buildTags } from '../../../../entities/Tags';
import { Accent, buildAccents } from '../../../../entities/Accent';
import {
  INITIAL_SENTENCE,
  useHandleSentences,
} from '../../../../services/useSentences';

const InitializeSentencesPane = ({ article }: { article: Article }) => {
  const { createSentences } = useHandleSentences();

  const [kanaArray, setKanaArray] = useState<string[]>([]);
  const [chineseArray, setChineseArray] = useState<string[]>([]);
  const [originalArray, setOriginalArray] = useState<string[]>([]);
  const [japaneseArray, setJapaneseArray] = useState<string[]>([]);
  const [accentStringArray, setAccentStringArray] = useState<string[]>([]);

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
    const lines = value.split('\n').filter((i) => i);
    setAccentStringArray(lines);
  };

  const handleChangeChinese = (value: string) => {
    const lines = value.split('\n').filter((i) => i);
    setChineseArray(lines);
  };

  const handleWriteBatch = async () => {
    const accentsArray: Accent[][] = accentStringArray.map((line) =>
      buildAccents(line)
    );

    if (
      japaneseArray.length !== accentStringArray.length ||
      japaneseArray.length !== originalArray.length ||
      japaneseArray.length !== kanaArray.length ||
      japaneseArray.length !== chineseArray.length
    ) {
      window.alert(
        `行数が一致しません。\n修正文: ${japaneseArray.length}\n原文: ${originalArray.length}\nかな: ${kanaArray.length}\nアクセント: ${accentStringArray.length}\n中文: ${chineseArray.length}`
      );
      return;
    }
    const sentences: Omit<Sentence, 'id'>[] = [];
    japaneseArray.forEach((_, index) => {
      const kana = kanaArray[index];
      const chinese = chineseArray[index];
      const accents = accentsArray[index];
      const original = originalArray[index];
      const japanese = japaneseArray[index];

      const { id, ...omitted } = INITIAL_SENTENCE;

      const sentence: Omit<Sentence, 'id'> = {
        ...omitted,
        line: index,
        uid: article.uid,
        kana,
        article: article.id,
        title: article.title,
        chinese,
        accents,
        original,
        japanese,
        createdAt: new Date().getTime(),
        tags: buildTags([japanese, chinese, kana, original]),
      };
      sentences.push(sentence);
    });

    createSentences(sentences);
  };

  return (
    <div style={{ display: 'grid', rowGap: 16 }}>
      <StyledTextField
        label='japanese'
        superHandleChange={handleChangeJapanese}
      />
      <StyledTextField
        label='original'
        superHandleChange={handleChangeOriginal}
      />
      <StyledTextField label='kana' superHandleChange={handleChangeKana} />
      <StyledTextField
        label='accentString'
        superHandleChange={handleChangeAccentString}
      />

      {accentStringArray.map((accentString, index) => (
        <div key={index}>
          <span style={{ fontSize: 12 }}>{japaneseArray[index] || ''}</span>
          <SentencePitchLine pitchesArray={string2PitchesArray(accentString)} />
        </div>
      ))}

      <StyledTextField
        label='chinese'
        superHandleChange={handleChangeChinese}
      />
      <Button color='primary' variant='contained' onClick={handleWriteBatch}>
        <span style={{ color: 'white' }}>送信</span>
      </Button>
    </div>
  );
};

export default InitializeSentencesPane;

const StyledTextField = ({
  label,
  superHandleChange,
}: {
  label: string;
  superHandleChange: (value: string) => void;
}) => {
  const [input, setInput] = useState('');
  const handleInput = (input: string) => {
    setInput(input);
    superHandleChange(input);
  };
  return (
    <TextField
      rows={5}
      size='small'
      label={label}
      value={input}
      variant='outlined'
      multiline
      onChange={(e) => handleInput(e.target.value)}
    />
  );
};
