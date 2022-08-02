import React from 'react';
import { Button, Container } from '@mui/material';

import { Mark } from '../../../../entities/Mark';

import EditAudioPane from './EditAudioPane';
import { Article } from '../../../../Model';

const EditArticleVoicePaneComponent = ({
  peaks,
  marks,
  scale,
  labels,
  article,
  hasMarks,
  blankDuration,
  updateMarks,
  handleChangeEnd,
  handleUploadAudio,
  handleDeleteAudio,
  handleChangeStart,
  handleChangeBlankDuration,
}: {
  marks: Mark[];
  peaks: number[];
  scale: number;
  labels: string[];
  article: Article;
  hasMarks: boolean;
  blankDuration: number;
  updateMarks: () => Promise<void>;
  handleUploadAudio: (e: React.ChangeEvent<HTMLInputElement>) => Promise<void>;
  handleDeleteAudio: () => Promise<void>;
  handleChangeEnd: ({ index, end }: { index: number; end: number }) => void;
  handleChangeStart: ({
    index,
    start,
  }: {
    index: number;
    start: number;
  }) => void;
  handleChangeBlankDuration: (value: number) => void;
}) => {
  return (
    <Container maxWidth='sm'>
      <div style={{ display: 'grid', rowGap: 16 }}>
        {article.downloadURL ? (
          <EditAudioPane
            marks={marks}
            peaks={peaks}
            scale={scale}
            labels={labels}
            hasMarks={hasMarks}
            downloadURL={article.downloadURL}
            blankDuration={blankDuration}
            updateMarks={updateMarks}
            handleChangeEnd={handleChangeEnd}
            handleChangeStart={handleChangeStart}
            handleDeleteAudio={handleDeleteAudio}
            handleChangeBlankDuration={handleChangeBlankDuration}
          />
        ) : (
          <Button variant='contained' component='label'>
            Audio アップロード
            <input
              aria-label='audio mp3 upload'
              type='file'
              style={{ display: 'none' }}
              onChange={handleUploadAudio}
            />
          </Button>
        )}
      </div>
    </Container>
  );
};

export default EditArticleVoicePaneComponent;
