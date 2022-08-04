import React, { useEffect, useState } from 'react';
import string2PitchesArray from 'string2pitches-array';
import { SentencePitchLine } from '@chihatw/pitch-line.sentence-pitch-line';
import { Button, TextField } from '@mui/material';

import {
  Accent,
  ArticleSentence,
  INITIAL_ARTICLE_SENTENCE,
  State,
} from '../../../Model';
import { buildAccents } from '../../../services/quiz';
import {
  buildTags,
  kanaAccentsStr2AccentsString,
  kanaAccentsStr2Kana,
  setSentences,
} from '../../../services/article';
import { nanoid } from 'nanoid';
import { Action, ActionTypes } from '../../../Update';

const InitializeSentencesPane = ({
  state,
  dispatch,
}: {
  state: State;
  dispatch: React.Dispatch<Action>;
}) => {
  const { article } = state;
  const { id: articleId } = article;

  const [kanaArray, setKanaArray] = useState<string[]>([]);
  const [chineseArray, setChineseArray] = useState<string[]>([]);
  const [originalArray, setOriginalArray] = useState<string[]>([]);
  const [japaneseArray, setJapaneseArray] = useState<string[]>([]);
  const [accentStringArray, setAccentStringArray] = useState<string[]>([]);
  const [kanaAccentsStrArray, setKanaAccentsStrArray] = useState<string[]>([]);

  const handleChangeJapanese = (value: string) => {
    const lines = value.split('\n').filter((i) => i);
    setJapaneseArray(lines);
  };

  const handleChangeOriginal = (value: string) => {
    const lines = value.split('\n').filter((i) => i);
    setOriginalArray(lines);
  };

  const handleChangeKanaAccentsStr = (value: string) => {
    const lines = value.split('\n').filter((i) => i);
    setKanaAccentsStrArray(lines);

    const kanaLines: string[] = [];
    const accentStringLines: string[] = [];
    for (const line of lines) {
      const kana = kanaAccentsStr2Kana(line);
      const accentString = kanaAccentsStr2AccentsString(line);
      kanaLines.push(kana);
      accentStringLines.push(accentString);
    }
    setKanaArray(kanaLines);
    setAccentStringArray(accentStringLines);
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
    const sentences: ArticleSentence[] = [];
    japaneseArray.forEach((_, index) => {
      const kana = kanaArray[index];
      const chinese = chineseArray[index];
      const accents = accentsArray[index];
      const original = originalArray[index];
      const japanese = japaneseArray[index];
      const kanaAccentsStr = kanaAccentsStrArray[index];

      const sentence: ArticleSentence = {
        ...INITIAL_ARTICLE_SENTENCE,
        id: nanoid(8),
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
        kanaAccentsStr,
        tags: buildTags([japanese, chinese, kana, original]),
      };
      sentences.push(sentence);
    });

    dispatch({
      type: ActionTypes.updateSentences,
      payload: { articleId, sentences },
    });
    setSentences(sentences);
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
      <StyledTextField
        label='kanaAccentsStr'
        superHandleChange={handleChangeKanaAccentsStr}
      />
      <StyledTextField
        label='kana'
        superInput={kanaArray.join('\n')}
        superHandleChange={handleChangeKana}
      />
      <StyledTextField
        label='accentString'
        superInput={accentStringArray.join('\n')}
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
  superInput,
  superHandleChange,
}: {
  label: string;
  superInput?: string;
  superHandleChange: (value: string) => void;
}) => {
  const [input, setInput] = useState('');
  useEffect(() => {
    if (typeof superInput === 'undefined') return;
    setInput(superInput);
  }, [superInput]);
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
