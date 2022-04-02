import React from 'react';
import { SentencePitchLine } from '@chihatw/pitch-line.sentence-pitch-line';
import accentsForPitchesArray from 'accents-for-pitches-array';
import { Box, Grid, Button, TextField } from '@mui/material';

import { CreateOndokuSentence } from '../../../../entities/OndokuSentence';

const OndokuSentenceInitialForm: React.FC<{
  japanese: string;
  accentString: string;
  onChangeJapanese: (japanese: string) => void;
  onChangeAccentString: (accentString: string) => void;
  ondokuSentences: CreateOndokuSentence[];
  onSubmit: () => void;
  isValid: boolean;
}> = ({
  japanese,
  accentString,
  onChangeJapanese,
  onChangeAccentString,
  ondokuSentences,
  onSubmit,
  isValid,
}) => {
  return (
    <Grid container direction='column' spacing={2}>
      <Grid item>
        <TextField
          variant='outlined'
          size='small'
          fullWidth
          multiline
          rows={5}
          label='japanese'
          value={japanese}
          onChange={(e) => onChangeJapanese(e.target.value)}
        />
      </Grid>
      <Grid item>
        <TextField
          variant='outlined'
          size='small'
          fullWidth
          multiline
          rows={5}
          label='accentString'
          value={accentString}
          onChange={(e) => onChangeAccentString(e.target.value)}
        />
      </Grid>
      <Grid item>
        <Box fontSize={12} px={2}>
          <Grid container direction='column' spacing={2}>
            {ondokuSentences.map((s, index) => (
              <Grid item key={index}>
                {s.japanese}
                <SentencePitchLine
                  pitchesArray={accentsForPitchesArray(s.accents)}
                />
              </Grid>
            ))}
          </Grid>
        </Box>
      </Grid>
      <Grid item>
        <Button
          fullWidth
          variant='contained'
          color='primary'
          style={{ color: 'white' }}
          onClick={onSubmit}
          disabled={!isValid}
        >
          送信
        </Button>
      </Grid>
    </Grid>
  );
};

export default OndokuSentenceInitialForm;
