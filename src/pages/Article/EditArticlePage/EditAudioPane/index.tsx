import React from 'react';
import CheckIcon from '@mui/icons-material/Check';
import { Button, Table, TableBody } from '@mui/material';
import { ArticleVoiceState } from '../Model';
import WaveCanvas from './WaveCanvas';
import MarksSlider from './MarksSlider';
import MarkRow from './MarkRow';

const EditAudioPane = ({
  state,
  dispatch,
  updateMarks,
  deleteAudio,
}: {
  state: ArticleVoiceState;
  dispatch: React.Dispatch<ArticleVoiceState>;
  updateMarks: () => void;
  deleteAudio: () => void;
}) => {
  const { labels, hasMarks } = state;
  // remote の変更があるので、上位コンポーネントで実装

  return (
    <div style={{ display: 'grid', rowGap: 16 }}>
      <div style={{ color: 'green' }}>{hasMarks && <CheckIcon />}</div>
      <WaveCanvas state={state} />
      <MarksSlider state={state} dispatch={dispatch} />
      <Button color='primary' variant='contained' onClick={deleteAudio}>
        音声削除
      </Button>
      <Table size='small'>
        <TableBody>
          {labels.map((_, index) => (
            <MarkRow
              key={index}
              index={index}
              state={state}
              dispatch={dispatch}
            />
          ))}
        </TableBody>
      </Table>
      <Button color='primary' variant='contained' onClick={updateMarks}>
        音声marks更新
      </Button>
    </div>
  );
};

export default EditAudioPane;
