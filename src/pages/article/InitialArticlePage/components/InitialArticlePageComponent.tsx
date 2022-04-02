import React from 'react';
import { SentencePitchLine } from '@chihatw/pitch-line.sentence-pitch-line';
import { Button } from '@mui/material';

import { Accent } from '../../../../entities/Accent';
import { Article } from '../../../../services/useArticles';
import TableLayout from '../../../../components/templates/TableLayout';
import StyledTextField from './StyledTextField';
import accentsForPitchesArray from 'accents-for-pitches-array';

const InitialArticlePageComponent = ({
  article,
  isValid,
  accentsArray,
  japaneseArray,
  onSubmit,
  handleChangeKana,
  handleChangeChinese,
  handleChangeOriginal,
  handleChangeJapanese,
  handleChangeAccentString,
}: {
  isValid: boolean;
  article: Article;
  accentsArray: Accent[][];
  japaneseArray: string[];
  onSubmit: () => void;
  handleChangeKana: (value: string) => void;
  handleChangeChinese: (value: string) => void;
  handleChangeJapanese: (value: string) => void;
  handleChangeOriginal: (value: string) => void;
  handleChangeAccentString: (value: string) => void;
}) => (
  <TableLayout title={`${article.title} - 初期化`} backURL='/article/list'>
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

      <div style={{ display: 'grid', rowGap: 16 }}>
        {accentsArray.map((accents, index) => (
          <div key={index}>
            <span style={{ fontSize: 12 }}>{japaneseArray[index] || ''}</span>
            <SentencePitchLine pitchesArray={accentsForPitchesArray(accents)} />
          </div>
        ))}
      </div>

      <StyledTextField
        label='chinese'
        superHandleChange={handleChangeChinese}
      />
      <Button
        color='primary'
        variant='contained'
        onClick={onSubmit}
        disabled={!isValid}
      >
        <span style={{ color: 'white' }}>送信</span>
      </Button>
    </div>
  </TableLayout>
);

export default InitialArticlePageComponent;
