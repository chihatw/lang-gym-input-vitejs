import React, { useEffect, useMemo, useState } from 'react';
import { Check } from '@mui/icons-material';
import { Button } from '@mui/material';

import { Mark } from '../../../entities/Mark';
import MarkTable from './MarkTable';
import WaveCanvas from './WaveCanvas';
import MarksSlider from './MarksSlider';
import PlayButtonPane from './PlayButtonPane';
import { buildSentenceLines } from '../../../services/buildSentenceLines';

const WAVE_COLOR = 'pink';
const HEIGHT = 100;

const EditAudioPane = ({
  peaks,
  marks,
  scale,
  labels,
  hasMarks,
  downloadURL,
  isAssignment,
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
  isAssignment?: boolean;
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
  const audioElement = useMemo(() => new Audio(downloadURL), []);

  useEffect(() => {
    return () => {
      audioElement.pause();
    };
  }, [audioElement]);

  const handlePlay = () => {
    let _isPlaying = isPlaying;

    audioElement.pause();
    setIsPlaying(false);

    if (!_isPlaying) {
      audioElement.currentTime = currentTime;
      audioElement.ontimeupdate = () => {
        setCurrentTime(audioElement!.currentTime);
        if (audioElement.currentTime > duration) {
          audioElement.pause();
          setIsPlaying(false);
          setCurrentTime(0);
        }
      };
      audioElement.play();
      setIsPlaying(true);
    }
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

      <Button
        color={isAssignment ? 'secondary' : 'primary'}
        variant='contained'
        onClick={handleDeleteAudio}
      >
        {isAssignment ? '提出音声削除' : '音声削除'}
      </Button>

      <MarkTable
        marks={marks}
        labels={labels}
        downloadURL={downloadURL}
        setCurrentTime={setCurrentTime}
        handleChangeEnd={handleChangeEnd}
        handleChangeStart={handleChangeStart}
      />

      <Button
        color={isAssignment ? 'secondary' : 'primary'}
        variant='contained'
        onClick={updateMarks}
      >
        {isAssignment ? '提出音声marks更新' : '音声marks更新'}
      </Button>
    </div>
  );
};

export default EditAudioPane;
