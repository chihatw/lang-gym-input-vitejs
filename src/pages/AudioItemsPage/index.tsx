import { Container, Table, TableBody } from '@mui/material';
import React, { useContext } from 'react';

import { AppContext } from '../../services/app';
import AudioItemRow from './components/AudioItemRow';
import { useHandleAudioItems } from '../../services/useAudioItems';

const AudioItemsPage = () => {
  const { audioItems } = useContext(AppContext);
  const { deleteAudioItem } = useHandleAudioItems();
  return (
    <Container maxWidth='sm'>
      <div style={{ height: 20 }} />
      <Table size='small'>
        <TableBody>
          {audioItems.map((audioItem, index) => (
            <AudioItemRow
              key={index}
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
