import React from 'react';
import Speaker from '@bit/chihatw.lang-gym.speaker';
import { SentencePitchLine } from '@chihatw/pitch-line.sentence-pitch-line';
import accentsForPitchesArray from 'accents-for-pitches-array';
import { Box, Grid, Button, TextField } from '@mui/material';

import { buildAccents } from '../../../../entities/Accent';

const OndokuSentenceForm: React.FC<{
  japanese: string;
  accentString: string;
  start: number;
  end: number;
  downloadURL: string;
  onChangeJapanese: (japanese: string) => void;
  onChangeAccentString: (accentString: string) => void;
  onChangeStart: (start: number) => void;
  onChangeEnd: (end: number) => void;
  onSubmit: () => void;
}> = ({
  japanese,
  accentString,
  start,
  end,
  downloadURL,
  onChangeJapanese,
  onChangeAccentString,
  onChangeStart,
  onChangeEnd,
  onSubmit,
}) => {
  return (
    <Grid container direction='column' spacing={2}>
      <Grid item>
        <TextField
          variant='outlined'
          size='small'
          fullWidth
          label='japanese'
          value={japanese}
          onChange={(e) => onChangeJapanese(e.target.value)}
        />
      </Grid>
      <Grid item>
        <Box px={1}>
          <SentencePitchLine
            pitchesArray={accentsForPitchesArray(buildAccents(accentString))}
          />
        </Box>
      </Grid>
      <Grid item>
        <TextField
          variant='outlined'
          size='small'
          fullWidth
          label='accents'
          value={accentString}
          onChange={(e) => onChangeAccentString(e.target.value)}
          multiline
          rows={5}
        />
      </Grid>
      <Grid item>
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
      </Grid>
      <Grid item>
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
      </Grid>
      <Grid item>
        <Speaker start={start} end={end} downloadURL={downloadURL} />
      </Grid>
      <Grid item>
        <Button
          variant='contained'
          color='primary'
          fullWidth
          style={{ color: 'white' }}
          onClick={onSubmit}
        >
          更新
        </Button>
      </Grid>
    </Grid>
  );
};

export default OndokuSentenceForm;
