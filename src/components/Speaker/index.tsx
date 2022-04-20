import React from 'react';
import VolumeUpIcon from '@mui/icons-material/VolumeUp';
import { IconButton, IconButtonProps } from '@mui/material';

import { useSpeaker } from './services/speaker';

export type SpeakerProps = {
  start: number;
  end: number;
  downloadURL: string;
};

const Speaker: React.FC<
  {
    start: number;
    end: number;
    downloadURL: string;
  } & IconButtonProps
> = ({ start, end, downloadURL, ...props }) => {
  const onPlay = useSpeaker({ start, end, downloadURL });
  return (
    <IconButton style={{ color: '#86bec4' }} onClick={onPlay} {...props}>
      <VolumeUpIcon />
    </IconButton>
  );
};

export default Speaker;
