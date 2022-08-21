import * as R from 'ramda';
import { Button, TextField } from '@mui/material';
import { SentencePitchLine } from '@chihatw/pitch-line.sentence-pitch-line';
import accentsForPitchesArray from 'accents-for-pitches-array';
import React, { useState, useEffect, useContext } from 'react';

import { Action, ActionTypes } from '../../../../../Update';
import AudioSlider from '../../../../../components/AudioSlider';

import { ArticleSentence, State } from '../../../../../Model';
import { buildAccents, buildAccentString } from '../../../../../services/quiz';
import {
  updateSentence,
  kanaAccentsStr2Kana,
  kanaAccentsStr2AccentsString,
  buildTags,
} from '../../../../../services/article';
import { AppContext } from '../../../../../App';

const EditSentencePane = ({
  callback,
  sentenceIndex,
}: {
  callback: () => void;
  sentenceIndex: number;
}) => {
  const { state, dispatch } = useContext(AppContext);
  const { article, sentences, audioContext, blobs } = state;
  const { id: articleId } = article;
  const sentence = sentences[sentenceIndex];

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
    if (!dispatch) return;
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

    const updatedSentences = state.sentences.map((item) =>
      item.id === newSentence.id ? newSentence : item
    );

    const updatedState = R.compose(
      R.assocPath<ArticleSentence[], State>(['sentences'], updatedSentences),
      R.assocPath<ArticleSentence[], State>(
        ['memo', 'sentences', articleId],
        updatedSentences
      )
    )(state);

    dispatch({ type: ActionTypes.setState, payload: updatedState });
    await updateSentence(newSentence);

    callback();
  };

  let blob: Blob | null = null;
  if (article.downloadURL) {
    blob = blobs[article.downloadURL];
  }

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
      {!!audioContext && !!blob && (
        <AudioSlider
          start={start}
          end={end}
          spacer={5}
          audioContext={audioContext}
          blob={blob}
        />
      )}

      <div
        style={{
          display: 'grid',
          columnGap: 16,
          gridTemplateColumns: ' 80px 80px',
        }}
      >
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
