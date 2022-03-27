import Delete from '@mui/icons-material/Delete';
import Stop from '@mui/icons-material/Stop';
import PlayArrow from '@mui/icons-material/PlayArrow';
import { TableRow, TableCell, IconButton } from '@mui/material';
import React, { useState } from 'react';
import { Player } from '../classes/Player';
import { AudioItem } from '../../../../services/useAudioItems';

const userNames: { [key: string]: string } = {
  wlEJSmstCvaQYFTaug9oYvhLoCH2: '原田',
};

const AudioItemRow = ({
  player,
  audioItem,
  deleteRow,
}: {
  player: Player;
  audioItem: AudioItem;
  deleteRow: () => void;
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  player.dataURI = audioItem.dataURI;
  player.handleOnEnd = () => setIsPlaying(false);

  const handleClick = () => {
    if (isPlaying) {
      player.stop();
    } else {
      player.play();
    }
    setIsPlaying(!isPlaying);
  };

  return (
    <TableRow>
      <TableCell>{userNames[audioItem.uid]}</TableCell>
      <TableCell>{audioItem.workoutId}</TableCell>
      <TableCell>{audioItem.bpm}</TableCell>
      <TableCell>
        {audioItem.isDeleted ? '×' : audioItem.isPerfect ? '○' : '△'}
      </TableCell>
      <TableCell>
        <IconButton onClick={handleClick}>
          {isPlaying ? <Stop /> : <PlayArrow />}
        </IconButton>
      </TableCell>
      <TableCell>
        <IconButton onClick={deleteRow}>
          <Delete />
        </IconButton>
      </TableCell>
    </TableRow>
  );
};

export default AudioItemRow;
