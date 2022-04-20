import { Button, Divider, TextField } from '@mui/material';
import { SentencePitchLine } from '@chihatw/pitch-line.sentence-pitch-line';
import accentsForPitchesArray from 'accents-for-pitches-array';
import React, { useState, useContext } from 'react';
import {
  Sentence,
  useHandleSentences,
} from '../../../../services/useSentences';
import { AppContext } from '../../../../services/app';
import { buildAccents, buildAccentString } from '../../../../entities/Accent';
import { buildTags } from '../../../../entities/Tags';
import Speaker from '../../../../components/Speaker';

const EditSentencePane = ({
  sentence,
  callback,
}: {
  sentence: Sentence;
  callback: () => void;
}) => {
  const { article } = useContext(AppContext);
  const { updateSentence } = useHandleSentences();

  const [end, setEnd] = useState(sentence.end);
  const [kana, setKana] = useState(sentence.kana);
  const [start, setStart] = useState(sentence.start);
  const [chinese, setChinese] = useState(sentence.chinese);
  const [japanese, setJapanese] = useState(sentence.japanese);
  const [original, setOriginal] = useState(sentence.original);
  const [accentString, setAccentString] = useState(
    buildAccentString(sentence.accents)
  );

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
  const handleClickUpdate = async () => {
    const newSentence: Sentence = {
      ...sentence,
      end,
      kana,
      start,
      tags: buildTags([japanese, original, chinese, kana]),
      accents: buildAccents(accentString),
      chinese,
      japanese,
      original,
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
