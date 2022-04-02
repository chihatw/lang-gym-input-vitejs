import { Container, Table, TableBody } from '@mui/material';
import React, { useContext, useMemo } from 'react';

import { Player } from './classes/Player';
import { AppContext } from '../../services/app';
import AudioItemRow from './components/AudioItemRow';

const AudioItemsPage = () => {
  const { audioItems, deleteAudioItem } = useContext(AppContext);
  const player = useMemo(
    () => new Player({ audioContext: new AudioContext() }),
    []
  );
  return (
    <Container maxWidth='sm'>
      <div style={{ height: 20 }} />
      <Table size='small'>
        <TableBody>
          {audioItems.map((audioItem, index) => (
            <AudioItemRow
              key={index}
              player={player}
              audioItem={audioItem}
              deleteRow={() => deleteAudioItem(audioItem.id)}
            />
          ))}
        </TableBody>
      </Table>
    </Container>
  );
};

export default AudioItemsPage;
