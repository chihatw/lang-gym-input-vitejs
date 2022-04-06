import React from 'react';
import AudioEdit from '@bit/chihatw.lang-gym.audio-edit'; // TODO 内部化

import { Mark } from '../../../../entities/Mark';
// TODO merge to Edit Article Page
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
  if (!!downloadURL) {
    return (
      <AudioEdit
        marks={marks}
        sentences={sentences}
        hasChange={hasChange}
        downloadURL={downloadURL}
        onSubmit={onSubmit}
        onDeleteAudio={onDeleteAudio}
        onChangeMarks={onChangeMarks}
      />
    );
  } else {
    return <></>;
  }
};

export default ArticleAssignmentVoice;
