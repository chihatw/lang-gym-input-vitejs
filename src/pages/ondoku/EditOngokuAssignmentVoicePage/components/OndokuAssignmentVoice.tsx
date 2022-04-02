import AudioEdit from '@bit/chihatw.lang-gym.audio-edit';
import React from 'react';
import { Mark } from '../../../../entities/Mark';

const OndokuAssignmentVoice: React.FC<{
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
    <div>
      {!!props.downloadURL && <AudioEdit {...props} sentences={sentences} />}
    </div>
  );
};

export default OndokuAssignmentVoice;
