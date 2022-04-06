import React, { useMemo, useState } from 'react';
import { Check } from '@mui/icons-material';
import { Button } from '@mui/material';

import { Mark } from '../../../../entities/Mark';
import MarkTable from './MarkTable';
import WaveCanvas from './WaveCanvas';
import MarksSlider from './MarksSlider';
import PlayButtonPane from './PlayButtonPane';
import { buildSentenceLines } from '../../../../services/buildSentenceLines';

const WAVE_COLOR = 'pink';
const HEIGHT = 100;

const EditAudioPane = ({
  peaks,
  marks,
  scale,
  labels,
  hasMarks,
  downloadURL,
  blankDuration,
  updateMarks,
  handleChangeEnd,
  handleChangeStart,
  handleDeleteAudio,
  handleChangeBlankDuration,
}: {
  marks: Mark[];
  scale: number;
  labels: string[];
  peaks: number[];
  hasMarks: boolean;
  downloadURL: string;
  blankDuration: number;
  updateMarks: () => void;
  handleChangeEnd: ({ index, end }: { index: number; end: number }) => void;
  handleDeleteAudio: () => void;
  handleChangeStart: ({
    index,
    start,
  }: {
    index: number;
    start: number;
  }) => void;
  handleChangeBlankDuration: (value: number) => void;
}) => {
  const duration = useMemo(() => peaks.length / scale, [peaks, scale]);
  const sentenceLines = useMemo(
    () =>
      buildSentenceLines({
        marks,
        scale,
      }),
    [marks, scale]
  );

  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [audioElement, setAudioElement] = useState<HTMLAudioElement | null>(
    null
  );

  const handlePlay = () => {
    let _audioElement = audioElement;
    let _isPlaying = isPlaying;
    if (!_audioElement) {
      console.log('get audio');
      _audioElement = new Audio(downloadURL);
      setAudioElement(_audioElement);
    }
    _audioElement.pause();
    setIsPlaying(false);

    if (!_isPlaying) {
      _audioElement.currentTime = currentTime;
      _audioElement.ontimeupdate = () => {
        setCurrentTime(_audioElement!.currentTime);
        if (_audioElement!.currentTime > duration) {
          _audioElement!.pause();
          setIsPlaying(false);
          setCurrentTime(0);
        }
      };
      _audioElement.play();
      setIsPlaying(true);
    }
  };

  const handlePlayMarkRow = (index: number) => {
    let _audioElement = audioElement;
    if (!_audioElement) {
      console.log('get audio');
      _audioElement = new Audio(downloadURL);
      setAudioElement(_audioElement);
    }
    _audioElement.pause();
    _audioElement.currentTime = marks[index].start;
    _audioElement.ontimeupdate = () => {
      setCurrentTime(_audioElement!.currentTime);
      if (_audioElement!.currentTime > marks[index].end) {
        _audioElement!.pause();
      }
    };
    _audioElement.play();
  };

  return (
    <div style={{ display: 'grid', rowGap: 16 }}>
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
    </div>
  );
};

export default EditAudioPane;
