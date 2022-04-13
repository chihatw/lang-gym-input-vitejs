import React from 'react';
import Speaker from '@bit/chihatw.lang-gym.speaker';
import { SentencePitchLine } from '@chihatw/pitch-line.sentence-pitch-line';
import { Button, TextField } from '@mui/material';
import accentsForPitchesArray from 'accents-for-pitches-array';

import { Accent, buildAccents } from '../../../../entities/Accent';
import { OndokuSentence } from '../../../../services/useOndokuSentences';

const OndokuAssignmentSentence: React.FC<{
  sentence: OndokuSentence;
  start: number;
  onChangeStart: (start: number) => void;
  end: number;
  onChangeEnd: (end: number) => void;
  downloadURL: string;
  accentString: string;
  onChangeAccentString: (accentString: string) => void;
  onSubmit: () => void;
}> = ({
  sentence,
  start,
  onChangeStart,
  end,
  onChangeEnd,
  downloadURL,
  accentString,
  onChangeAccentString,
  onSubmit,
}) => {
  return (
    <>
      <CorrectSentence
        japanese={sentence.japanese}
        accents={sentence.accents}
      />
      <div style={{ height: 16 }} />
      <AccentStringInput
        accentString={accentString}
        onChangeAccentString={onChangeAccentString}
      />
      <div style={{ height: 16 }} />
      <SentencePitchLine
        pitchesArray={accentsForPitchesArray(buildAccents(accentString))}
      />
      <div style={{ height: 16 }} />
      <StartInput start={start} onChangeStart={onChangeStart} />
      <div style={{ height: 16 }} />
      <EndInput end={end} onChangeEnd={onChangeEnd} />

      {!!downloadURL && (
        <>
          <div style={{ height: 16 }} />
          <Speaker start={start} end={end} downloadURL={downloadURL} />
        </>
      )}
      <div style={{ height: 16 }} />
      <Button fullWidth variant='contained' onClick={onSubmit}>
        更新
      </Button>
    </>
  );
};

export default OndokuAssignmentSentence;

const CorrectSentence: React.FC<{ japanese: string; accents: Accent[] }> = ({
  japanese,
  accents,
}) => (
  <div style={{ background: '#eee', padding: 8, borderRadius: 4 }}>
    <div style={{ fontSize: 12, color: '#555' }}>{japanese}</div>
    <div style={{ height: 16 }} />
    <SentencePitchLine pitchesArray={accentsForPitchesArray(accents)} />
  </div>
);

const AccentStringInput: React.FC<{
  accentString: string;
  onChangeAccentString: (value: string) => void;
}> = ({ accentString, onChangeAccentString }) => (
  <TextField
    variant='outlined'
    size='small'
    fullWidth
    value={accentString}
    multiline
    rows={5}
    onChange={(e) => onChangeAccentString(e.target.value)}
  />
);

const StartInput: React.FC<{
  start: number;
  onChangeStart: (value: number) => void;
}> = ({ start, onChangeStart }) => (
  <TextField
    variant='outlined'
    size='small'
    fullWidth
    label='start'
    value={start}
    type='number'
    inputProps={{ step: 0.1 }}
    onChange={(e) => onChangeStart(Number(e.target.value))}
  />
);

const EndInput: React.FC<{
  end: number;
  onChangeEnd: (value: number) => void;
}> = ({ end, onChangeEnd }) => (
  <TextField
    variant='outlined'
    size='small'
    fullWidth
    label='end'
    value={end}
    type='number'
    inputProps={{ step: 0.1 }}
    onChange={(e) => onChangeEnd(Number(e.target.value))}
  />
);
