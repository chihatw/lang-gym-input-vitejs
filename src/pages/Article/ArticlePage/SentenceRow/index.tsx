import { SentencePitchLine } from '@chihatw/pitch-line.sentence-pitch-line';
import { Card } from '@mui/material';
import accentsForPitchesArray from 'accents-for-pitches-array';
import React, { useContext } from 'react';
import { AppContext } from '../../../../App';
import AudioSlider from '../../../../components/AudioSlider';
import { ArticleSentence } from '../../../../Model';
import SentenceRowFooter from './SentenceRowFooter';

const SentenceRow = ({
  blob,
  sentence,
  articleId,
}: {
  blob: Blob | null;
  sentence: ArticleSentence;
  articleId: string;
}) => {
  const { state } = useContext(AppContext);

  return (
    <Card>
      <div
        style={{
          color: '#555',
          rowGap: 16,
          padding: 16,
          display: 'grid',
          fontSize: 12,
        }}
      >
        <div style={{ display: 'grid', rowGap: 4 }}>
          <div style={{ userSelect: 'none' }}>{`${sentence.line + 1}. ${
            sentence.japanese
          }`}</div>
          <div style={{ color: '#aaa' }}>{sentence.original}</div>
          <div style={{ color: '#52a2aa' }}>{sentence.chinese}</div>
          <SentencePitchLine
            pitchesArray={accentsForPitchesArray(sentence.accents)}
          />
        </div>
        {!!state.audioContext && !!blob && (
          <AudioSlider
            blob={blob}
            audioContext={state.audioContext}
            spacer={5}
            start={sentence.start}
            end={sentence.end}
          />
        )}

        <SentenceRowFooter
          blob={blob}
          sentence={sentence}
          articleId={articleId}
        />
      </div>
    </Card>
  );
};

export default SentenceRow;
