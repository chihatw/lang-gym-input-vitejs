import { Button, TextField } from '@mui/material';
import { SentencePitchLine } from '@chihatw/pitch-line.sentence-pitch-line';
import accentsForPitchesArray from 'accents-for-pitches-array';
import React, { useState, useEffect } from 'react';
import {
  kanaAccentsStr2AccentsString,
  kanaAccentsStr2Kana,
  useHandleSentences,
} from '../../../../services/useSentences';

import { buildTags } from '../../../../entities/Tags';
import Speaker from '../../../../components/Speaker';
import { ArticleSentence, State } from '../../../../Model';
import { Action } from '../../../../Update';
import { buildAccents, buildAccentString } from '../../../../services/quiz';

const EditSentencePane = ({
  state,
  dispatch,
  callback,
  sentenceIndex,
}: {
  state: State;
  dispatch: React.Dispatch<Action>;
  callback: () => void;
  sentenceIndex: number;
}) => {
  const { article, sentences } = state;
  const sentence = sentences[sentenceIndex];
  const { updateSentence } = useHandleSentences();

  const [end, setEnd] = useState(0);
  const [kana, setKana] = useState('');
  const [start, setStart] = useState(0);
  const [chinese, setChinese] = useState('');
  const [japanese, setJapanese] = useState('');
  const [original, setOriginal] = useState('');
  const [accentString, setAccentString] = useState('');
  const [kanaAccentsStr, setKanaAccentsStr] = useState('');

  useEffect(() => {
    if (!sentence.id) return;
    const {
      end,
      kana,
      start,
      chinese,
      japanese,
      original,
      accents,
      kanaAccentsStr,
    } = sentence;
    setEnd(end);
    setKana(kana);
    setStart(start);
    setChinese(chinese);
    setJapanese(japanese);
    setOriginal(original);
    const accentString = buildAccentString(accents);
    setAccentString(accentString);
    setKanaAccentsStr(kanaAccentsStr);
  }, [sentence]);

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

  const onChangeKanaAccentsStr = (value: string) => {
    setKanaAccentsStr(value);
    const kana = kanaAccentsStr2Kana(value);
    const accentString = kanaAccentsStr2AccentsString(value);
    setKana(kana);
    setAccentString(accentString);
  };

  const handleClickUpdate = async () => {
    const newSentence: ArticleSentence = {
      ...sentence,
      end,
      kana,
      start,
      tags: buildTags([japanese, original, chinese, kana]),
      accents: buildAccents(accentString),
      chinese,
      japanese,
      original,
      kanaAccentsStr,
    };
    const updatedItem = await updateSentence(newSentence);
    if (!!updatedItem) {
      callback();
    }
  };

  return (
    <div style={{ display: 'grid', rowGap: 16 }}>
      <TextField
        variant='outlined'
        size='small'
        label='japanese'
        value={japanese}
        onChange={(e) => onChangeJapanese(e.target.value)}
      />
      <TextField
        variant='outlined'
        size='small'
        label='original'
        value={original}
        onChange={(e) => onChangeOriginal(e.target.value)}
      />
      <TextField
        variant='outlined'
        size='small'
        label='chinese'
        value={chinese}
        onChange={(e) => onChangeChinese(e.target.value)}
      />
      <TextField
        variant='outlined'
        size='small'
        label='kanaAccentsStr'
        value={kanaAccentsStr}
        onChange={(e) => onChangeKanaAccentsStr(e.target.value)}
      />
      <TextField
        variant='outlined'
        size='small'
        label='kana'
        value={kana}
        onChange={(e) => onChangeKana(e.target.value)}
      />
      <TextField
        variant='outlined'
        size='small'
        label='accents'
        value={accentString}
        onChange={(e) => onChangeAccentString(e.target.value)}
        multiline
      />
      <div style={{ padding: '16px 8px 0' }}>
        <SentencePitchLine
          pitchesArray={accentsForPitchesArray(buildAccents(accentString))}
        />
      </div>
      <div
        style={{
          display: 'grid',
          columnGap: 16,
          gridTemplateColumns: '32px 80px 80px',
        }}
      >
        <Speaker start={start} end={end} downloadURL={article.downloadURL} />
        <TextField
          variant='outlined'
          size='small'
          type='number'
          label='start'
          value={start}
          onChange={(e) => onChangeStart(Number(e.target.value))}
          inputProps={{ step: 0.1 }}
        />
        <TextField
          size='small'
          type='number'
          label='end'
          value={end}
          variant='outlined'
          inputProps={{ step: 0.1 }}
          onChange={(e) => onChangeEnd(Number(e.target.value))}
        />
      </div>
      <Button
        variant='contained'
        color='primary'
        fullWidth
        style={{ color: 'white' }}
        onClick={handleClickUpdate}
        sx={{ marginTop: 5 }}
      >
        更新
      </Button>
    </div>
  );
};

export default EditSentencePane;
