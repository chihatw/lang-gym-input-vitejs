import React from 'react';
import { Button } from '@mui/material';

import { Mark } from '../../../../entities/Mark';
import MarkTable from './MarkTable';
import WaveCanvas from './WaveCanvas';
import TableLayout from '../../../../components/templates/TableLayout';
import { Article } from '../../../../services/useArticles';
import MarksSlider from './MarksSlider';
import PlayButtonPane from './PlayButtonPane';

const WAVE_COLOR = 'pink';
const HEIGHT = 100;

const EditArticleVoicePageComponent = ({
  peaks,
  marks,
  scale,
  article,
  duration,
  labels,
  isPlaying,
  currentTime,
  blankDuration,
  sentenceLines,
  onUpload,
  onSubmit,
  handlePlay,
  onDeleteAudio,
  handleChangeEnd,
  handleChangeStart,
  handlePlayMarkRow,
  handleChangeBlankDuration,
}: {
  marks: Mark[];
  peaks: number[];
  scale: number;
  article: Article;
  duration: number;
  labels: string[];
  isPlaying: boolean;
  currentTime: number;
  sentenceLines: { xPos: number; color: string }[];
  blankDuration: number;
  onUpload: (e: React.ChangeEvent<HTMLInputElement>) => Promise<void>;
  onSubmit: () => Promise<void>;
  handlePlay: () => void;
  onDeleteAudio: () => Promise<void>;
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
    <TableLayout title={`${article.title} - 録音`} backURL='/article/list'>
      {article.downloadURL ? (
        <div style={{ display: 'grid', rowGap: 16 }}>
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

          <Button variant='contained' onClick={onDeleteAudio}>
            delete audio file
          </Button>

          <MarkTable
            marks={marks}
            labels={labels}
            handleChangeEnd={handleChangeEnd}
            handleChangeStart={handleChangeStart}
            handlePlayMarkRow={handlePlayMarkRow}
          />

          <Button variant='contained' onClick={onSubmit}>
            送信
          </Button>
        </div>
      ) : (
        <Button variant='contained' component='label'>
          アップロード
          <input
            aria-label='audio mp3 upload'
            type='file'
            style={{ display: 'none' }}
            onChange={onUpload}
          />
        </Button>
      )}
    </TableLayout>
  );
};

export default EditArticleVoicePageComponent;
