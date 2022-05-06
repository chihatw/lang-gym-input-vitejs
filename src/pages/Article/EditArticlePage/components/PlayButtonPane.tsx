import PauseIcon from '@mui/icons-material/Pause';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import { IconButton } from '@mui/material';
import React from 'react';

const PlayButtonPane: React.FC<{
  duration: number;
  isPlaying: boolean;
  currentTime: number;
  handlePlay: () => void;
}> = ({ duration, isPlaying, currentTime, handlePlay }) => {
  return (
    <div style={{ display: 'flex', alignItems: 'center' }}>
      <IconButton size='small' color='primary' onClick={handlePlay}>
        {isPlaying ? <PauseIcon /> : <PlayArrowIcon />}
      </IconButton>
      <div style={{ display: 'flex', alignItems: 'center', color: '#555' }}>
        <Time seconds={currentTime} />
        <span>/</span>
        <Time seconds={duration} />
      </div>
    </div>
  );
};

export default PlayButtonPane;

const Time: React.FC<{ seconds: number }> = ({ seconds }) => {
  seconds = seconds > 0 ? seconds : 0;
  const mins = Math.floor(seconds / 60);
  const secs = Math.round(seconds % 60);
  return <span>{`${mins}:${secs < 10 ? '0' : ''}${secs}`}</span>;
};
