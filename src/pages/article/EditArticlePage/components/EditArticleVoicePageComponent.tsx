import React from 'react';
import { Button, Container } from '@mui/material';

import { Mark } from '../../../../entities/Mark';
import MarkTable from './MarkTable';
import WaveCanvas from './WaveCanvas';
import { Article } from '../../../../services/useArticles';
import MarksSlider from './MarksSlider';
import PlayButtonPane from './PlayButtonPane';
import { Check } from '@mui/icons-material';

const WAVE_COLOR = 'pink';
const HEIGHT = 100;

const EditArticleVoicePageComponent = ({
  peaks,
  marks,
  scale,
  labels,
  article,
  duration,
  hasMarks,
  isPlaying,
  currentTime,
  blankDuration,
  sentenceLines,
  handlePlay,
  updateMarks,
  handleChangeEnd,
  handleUploadAudio,
  handleDeleteAudio,
  handleChangeStart,
  handlePlayMarkRow,
  handleChangeBlankDuration,
}: {
  marks: Mark[];
  peaks: number[];
  scale: number;
  labels: string[];
  article: Article;
  hasMarks: boolean;
  duration: number;
  isPlaying: boolean;
  currentTime: number;
  sentenceLines: { xPos: number; color: string }[];
  blankDuration: number;
  updateMarks: () => Promise<void>;
  handleUploadAudio: (e: React.ChangeEvent<HTMLInputElement>) => Promise<void>;
  handlePlay: () => void;
  handleDeleteAudio: () => Promise<void>;
  handleChangeEnd: ({ index, end }: { index: number; end: number }) => void;
  handleChangeStart: ({
    index,
    start,
  }: {
    index: number;
    start: number;
  }) => void;
  handlePlayMarkRow: (value: number) => void;
  handleChangeBlankDuration: (value: number) => void;
}) => {
  return (
    <Container maxWidth='sm'>
      <div style={{ display: 'grid', rowGap: 16 }}>
        {article.downloadURL ? (
          <>
            <div style={{ color: 'green' }}>{hasMarks ? <Check /> : ''}</div>
            <PlayButtonPane
              duration={duration}
              isPlaying={isPlaying}
              handlePlay={handlePlay}
              currentTime={currentTime}
            />

            <WaveCanvas
              peaks={peaks}
              height={HEIGHT}
              color={WAVE_COLOR}
              sentenceLines={sentenceLines}
              currentTimePos={currentTime * scale}
            />

            <MarksSlider
              superValue={blankDuration}
              superHandleChangeValue={handleChangeBlankDuration}
            />

            <Button variant='contained' onClick={handleDeleteAudio}>
              delete audio file
            </Button>

            <MarkTable
              marks={marks}
              labels={labels}
              handleChangeEnd={handleChangeEnd}
              handleChangeStart={handleChangeStart}
              handlePlayMarkRow={handlePlayMarkRow}
            />

            <Button variant='contained' onClick={updateMarks}>
              送信
            </Button>
          </>
        ) : (
          <Button variant='contained' component='label'>
            Audio アップロード
            <input
              aria-label='audio mp3 upload'
              type='file'
              style={{ display: 'none' }}
              onChange={handleUploadAudio}
            />
          </Button>
        )}
      </div>
    </Container>
  );
};

export default EditArticleVoicePageComponent;
