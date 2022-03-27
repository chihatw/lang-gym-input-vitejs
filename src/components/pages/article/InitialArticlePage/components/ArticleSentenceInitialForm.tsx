import { SentencePitchLine } from '@chihatw/lang-gym-h.ui.sentence-pitch-line';
import { Box, Grid, Button, TextField } from '@mui/material';
import React from 'react';
import { CreateSentence } from '../../../../../entities/Sentence';

const ArticleSentenceInitialForm: React.FC<{
  japanese: string;
  original: string;
  kana: string;
  accentString: string;
  chinese: string;
  onChangeJapanese: (japanese: string) => void;
  onChangeOriginal: (original: string) => void;
  onChangeKana: (kana: string) => void;
  onChangeAccentString: (accentString: string) => void;
  onChangeChinese: (chinese: string) => void;
  sentences: CreateSentence[];
  onSubmit: () => void;
  isValid: boolean;
}> = ({
  japanese,
  original,
  kana,
  accentString,
  chinese,
  onChangeJapanese,
  onChangeOriginal,
  onChangeKana,
  onChangeAccentString,
  onChangeChinese,
  sentences,
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
          label='original'
          value={original}
          onChange={(e) => onChangeOriginal(e.target.value)}
        />
      </Grid>
      <Grid item>
        <TextField
          variant='outlined'
          size='small'
          fullWidth
          multiline
          rows={5}
          label='kana'
          value={kana}
          onChange={(e) => onChangeKana(e.target.value)}
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
      {!!accentString && (
        <Grid item>
          <Box fontSize={12}>
            <Grid container direction='column' spacing={2}>
              {sentences.map((s, index) => (
                <Grid item key={index}>
                  {s.japanese}
                  <SentencePitchLine accents={s.accents} />
                </Grid>
              ))}
            </Grid>
          </Box>
        </Grid>
      )}
      <Grid item>
        <TextField
          variant='outlined'
          size='small'
          fullWidth
          multiline
          rows={5}
          label='chinese'
          value={chinese}
          onChange={(e) => onChangeChinese(e.target.value)}
        />
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

export default ArticleSentenceInitialForm;
