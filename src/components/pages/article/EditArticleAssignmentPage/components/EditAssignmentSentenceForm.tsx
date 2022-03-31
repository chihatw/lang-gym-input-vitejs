import React from 'react';
import Speaker from '@bit/chihatw.lang-gym.speaker';
import { SentencePitchLine } from '@chihatw/pitch-line.sentence-pitch-line';
import { TextField, Button } from '@mui/material';
import accentsForPitchesArray from 'accents-for-pitches-array';

import { Sentence } from '../../../../../entities/Sentence';
import { buildAccents } from '../../../../../entities/Accent';

const EditAssignmentSentenceForm: React.FC<{
  end: number;
  start: number;
  sentence: Sentence;
  downloadURL: string;
  accentString: string;
  onSubmit: () => void;
  onChangeEnd: (end: number) => void;
  onChangeStart: (start: number) => void;
  onChangeAccentString: (accentString: string) => void;
}> = ({
  end,
  start,
  sentence,
  downloadURL,
  accentString,
  onSubmit,
  onChangeEnd,
  onChangeStart,
  onChangeAccentString,
}) => {
  return (
    <div
      style={{
        color: '#555',
        fontSize: 12,
      }}
    >
      <div>{`${sentence.line + 1}行目`}</div>
      <div style={{ height: 8 }} />
      <div
        style={{
          padding: 8,
          borderRadius: 4,
          backgroundColor: '#eee',
        }}
      >
        <div>{sentence.japanese}</div>
        <div style={{ height: 16 }} />
        <SentencePitchLine
          pitchesArray={accentsForPitchesArray(sentence.accents)}
        />
      </div>
      <div style={{ height: 16 }} />
      <TextField
        variant='outlined'
        size='small'
        fullWidth
        value={accentString}
        multiline
        rows={5}
        onChange={(e) => onChangeAccentString(e.target.value)}
      />
      <div style={{ height: 16 }} />
      <SentencePitchLine
        pitchesArray={accentsForPitchesArray(buildAccents(accentString))}
      />
      <div style={{ height: 16 }} />
      <TextField
        variant='outlined'
        size='small'
        fullWidth
        label='start'
        value={start}
        type='number'
        onChange={(e) => onChangeStart(Number(e.target.value))}
      />
      <div style={{ height: 16 }} />
      <TextField
        variant='outlined'
        size='small'
        fullWidth
        label='end'
        value={end}
        type='number'
        onChange={(e) => onChangeEnd(Number(e.target.value))}
      />
      <div style={{ height: 16 }} />
      {!!downloadURL && (
        <>
          <Speaker start={start} end={end} downloadURL={downloadURL} />
          <div style={{ height: 16 }} />
        </>
      )}
      <Button fullWidth variant='contained' onClick={onSubmit}>
        更新
      </Button>
    </div>
  );
};

export default EditAssignmentSentenceForm;
