import { SentencePitchLine } from '@chihatw/pitch-line.sentence-pitch-line';
import { Container, Divider } from '@mui/material';
import accentsForPitchesArray from 'accents-for-pitches-array';
import React, { useContext } from 'react';
import { AppContext } from '../../../services/app';
import { ArticleSentence } from '../../../services/useSentences';

const PrintPitchesPage = () => {
  const { sentences } = useContext(AppContext);

  return (
    <Container sx={{ paddingTop: 5, width: '180mm' }}>
      <div style={{ display: 'grid', rowGap: 8 }}>
        {sentences.map((sentence) => (
          <PitchesRow key={sentence.id} sentence={sentence} />
        ))}
      </div>
    </Container>
  );
};

export default PrintPitchesPage;

const PitchesRow = ({ sentence }: { sentence: ArticleSentence }) => {
  const { accents } = sentence;
  const pitchesArray = accentsForPitchesArray(accents);
  return (
    <>
      <div style={{ display: 'grid', gridTemplateColumns: '20px 1fr' }}>
        <div style={{ fontSize: 11, paddingLeft: 4, paddingTop: 4 }}>
          {sentence.line + 1}
        </div>
        <SentencePitchLine pitchesArray={pitchesArray} />
      </div>
      <Divider />
    </>
  );
};
