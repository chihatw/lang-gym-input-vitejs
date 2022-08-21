import { SentencePitchLine } from '@chihatw/pitch-line.sentence-pitch-line';
import { Card } from '@mui/material';
import accentsForPitchesArray from 'accents-for-pitches-array';
import React, { useContext } from 'react';
import { AppContext } from '../../../../App';
import AudioSlider from '../../../../components/AudioSlider';
import SentenceRowFooter from './SentenceRowFooter';

const SentenceRow = ({
  isSm,
  sentenceIndex,
}: {
  isSm: boolean;
  sentenceIndex: number;
}) => {
  const { state } = useContext(AppContext);
  const { article, sentences: articleSentences, audioContext, blobs } = state;
  const sentence = articleSentences[sentenceIndex];
  const { line, original, chinese, accents, japanese, start, end } = sentence;

  let blob: Blob | null = null;
  if (article.downloadURL) {
    blob = state.blobs[article.downloadURL];
  }

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
          <div style={{ userSelect: 'none' }}>{`${line + 1}. ${japanese}`}</div>
          <div style={{ color: '#aaa' }}>{original}</div>
          <div style={{ color: '#52a2aa' }}>{chinese}</div>
          <SentencePitchLine pitchesArray={accentsForPitchesArray(accents)} />
        </div>
        {!!audioContext && !!blob && (
          <AudioSlider
            blob={blob}
            audioContext={audioContext}
            spacer={5}
            start={start}
            end={end}
          />
        )}

        <SentenceRowFooter sentenceIndex={sentenceIndex} />
      </div>
    </Card>
  );
};

export default SentenceRow;
