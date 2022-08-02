import PauseIcon from '@mui/icons-material/Pause';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import { IconButton, Slider, useTheme } from '@mui/material';
import React, { useRef, useState } from 'react';
import { createSourceNode } from '../services/utils';

const AudioSlider = ({
  end,
  blob,
  start,
  spacer,
  audioContext,
}: {
  end: number;
  blob: Blob;
  start: number;
  spacer: number;
  audioContext: AudioContext;
}) => {
  const duration = end - start;

  const theme = useTheme();

  const [currentTime, setCurrentTime] = useState(0);
  const [sliderValue, setSliderValue] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  const rafIdRef = useRef(0);
  const spacerRef = useRef(0);
  const sourseNodeRef = useRef<AudioBufferSourceNode | null>(null);
  const startTimeRef = useRef(0);
  const offsetTimeRef = useRef(start); // 開始時間を start に合わせる
  const pausedRef = useRef(false);

  const play = async () => {
    if (!blob || !audioContext) return;
    const sourceNode = await createSourceNode(blob, audioContext);

    let offset = offsetTimeRef.current; // 開始位置を秒で指定
    // 再生開始時間が start, end の範囲外の場合、start の時間に合わせる
    if (offset < start || offset > end) {
      offset = start;
      offsetTimeRef.current = start;
    }

    // 停止された場合
    sourceNode.onended = () => {
      // 表示の変更
      setIsPlaying(false);
      window.cancelAnimationFrame(rafIdRef.current);
      if (!pausedRef.current) {
        setCurrentTime(0);
        setSliderValue(0);
        offsetTimeRef.current = start;
      }
    };

    const duration = end - offset;
    sourceNode.start(0, offset, duration);

    setIsPlaying(true);
    sourseNodeRef.current = sourceNode;
    startTimeRef.current = audioContext.currentTime;
    pausedRef.current = false;
    loop();
  };
  const loop = () => {
    if (!audioContext) return;

    const currentTime =
      audioContext.currentTime - startTimeRef.current + offsetTimeRef.current;

    setCurrentTime(currentTime);

    // 間引かないと slider の描画が更新されない
    if (spacerRef.current % spacer === 0) {
      setSliderValue(currentTimeToSliderValue(currentTime, duration, start));
    }

    rafIdRef.current = window.requestAnimationFrame(loop);
    spacerRef.current++;
  };

  const pause = () => {
    const sourceNode = sourseNodeRef.current;
    sourceNode && sourceNode.stop(0);
    // AudioBufferSourceNodeは使い捨て
    sourseNodeRef.current = null;

    setIsPlaying(false);
    window.cancelAnimationFrame(rafIdRef.current);

    if (!audioContext) return;
    const offsetTime = audioContext.currentTime - startTimeRef.current;
    offsetTimeRef.current = offsetTime;
    pausedRef.current = true;
  };

  const handleChangeSliderValue = (value: number) => {
    setSliderValue(value);
    const currentTime = sliderValueToCurrentTime(value, duration, start);
    setCurrentTime(currentTime);
    offsetTimeRef.current = currentTime;
  };

  return (
    <div
      style={{
        ...(theme.typography as any).mPlusRounded,
        display: 'flex',
        fontSize: 12,
        alignItems: 'center',
        whiteSpace: 'nowrap',
      }}
    >
      <IconButton
        sx={{ color: '#86bec4' }}
        onClick={() => (isPlaying ? pause() : play())}
      >
        {isPlaying ? <PauseIcon /> : <PlayArrowIcon />}
      </IconButton>
      <TimePane
        current={Math.min(Math.max(currentTime - start, 0), duration)}
        duration={duration}
      />
      <Slider
        sx={{ paddingTop: '14px', marginRight: '6px' }}
        color='primary'
        value={sliderValue}
        onChange={(_, value) => {
          handleChangeSliderValue(value as number);
        }}
      />
    </div>
  );
};

export default AudioSlider;

const currentTimeToSliderValue = (
  currentTime: number,
  duration: number,
  start: number
): number => {
  const value = duration ? ((currentTime - start) / duration) * 100 : 0;
  return Math.min(Math.max(value, 0), 100);
};

const sliderValueToCurrentTime = (
  sliderValue: number,
  duration: number,
  start?: number
): number => {
  return (duration * sliderValue) / 100 + (start || 0);
};

const TimePane = ({
  current,
  duration,
}: {
  current: number;
  duration: number;
}) => {
  return (
    <div style={{ color: '#777', marginRight: 16 }}>
      <Time seconds={current} />
      <span>/</span>
      <Time seconds={duration} />
    </div>
  );
};

const Time = ({ seconds }: { seconds: number }) => {
  seconds = seconds > 0 ? seconds : 0;
  const mins = Math.floor(seconds / 60);
  const secs = Math.round(seconds % 60);
  return <span>{`${mins}:${String(secs).padStart(2, '0')}`}</span>;
};
