import AudioEdit from '@bit/chihatw.lang-gym.audio-edit'; // TODO 内部化
import { Grid } from '@mui/material';
import React from 'react';
import { Mark } from '../../../../entities/Mark';

const ArticleAssignmentVoice: React.FC<{
  sentences: string[];
  uid: string;
  downloadURL: string;
  marks: Mark[];
  onDeleteAudio: () => void;
  onChangeMarks: (marks: Mark[]) => void;
  hasChange: boolean;
  onSubmit: () => void;
}> = ({ sentences, ...props }) => {
  return (
    <Grid container direction='column' spacing={2}>
      {!!props.downloadURL && (
        <Grid item>
          <AudioEdit {...props} sentences={sentences} />
        </Grid>
      )}
    </Grid>
  );
};

export default ArticleAssignmentVoice;
