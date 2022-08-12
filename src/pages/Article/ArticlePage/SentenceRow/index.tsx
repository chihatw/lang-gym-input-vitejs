import { SentencePitchLine } from '@chihatw/pitch-line.sentence-pitch-line';
import { SentenceFormPane } from '@chihatw/sentence-form.sentence-form-pane';
import { Card } from '@mui/material';
import accentsForPitchesArray from 'accents-for-pitches-array';
import React, { useContext } from 'react';
import { AppContext } from '../../../../App';
import AudioSlider from '../../../../components/AudioSlider';
import { INITIAL_ARTICLE_SENTENCE_FORM, State } from '../../../../Model';
import { Action } from '../../../../Update';
import SentenceRowFooter from './SentenceRowFooter';

const SentenceRow = ({
  isSm,
  sentenceIndex,
}: {
  isSm: boolean;
  sentenceIndex: number;
}) => {
  const { state } = useContext(AppContext);
  const {
    sentences: articleSentences,
    articleSentenceForms,
    audioContext,
    articleBlob,
  } = state;
  const sentence = articleSentences[sentenceIndex];
  const { line, original, chinese, accents, japanese, start, end } = sentence;

  const articleSentenceForm =
    articleSentenceForms[sentenceIndex] || INITIAL_ARTICLE_SENTENCE_FORM;
  const { sentences } = articleSentenceForm;
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
          {!!Object.keys(sentences).length && (
            <div style={{ maxWidth: isSm ? 500 : 800, overflowX: 'scroll' }}>
              <SentenceFormPane sentences={sentences} />
            </div>
          )}
        </div>
        {!!audioContext && !!articleBlob && (
          <AudioSlider
            blob={articleBlob}
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
