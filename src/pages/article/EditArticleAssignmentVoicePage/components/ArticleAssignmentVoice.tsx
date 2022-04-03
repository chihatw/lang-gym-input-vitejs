import React from 'react';
import { Grid } from '@mui/material';
import AudioEdit from '@bit/chihatw.lang-gym.audio-edit'; // TODO 内部化

import { Mark } from '../../../../entities/Mark';

const ArticleAssignmentVoice = ({
  marks,
  sentences,
  hasChange,
  downloadURL,
  onSubmit,
  onDeleteAudio,
  onChangeMarks,
}: {
  marks: Mark[];
  sentences: string[];
  hasChange: boolean;
  downloadURL: string;
  onSubmit: () => void;
  onDeleteAudio: () => void;
  onChangeMarks: (marks: Mark[]) => void;
}) => {
  return (
    <Grid container direction='column' spacing={2}>
      {!!downloadURL && (
        <Grid item>
          <AudioEdit
            marks={marks}
            sentences={sentences}
            hasChange={hasChange}
            downloadURL={downloadURL}
            onSubmit={onSubmit}
            onDeleteAudio={onDeleteAudio}
            onChangeMarks={onChangeMarks}
          />
        </Grid>
      )}
    </Grid>
  );
};

export default ArticleAssignmentVoice;
