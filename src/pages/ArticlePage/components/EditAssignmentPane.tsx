import Speaker from '@bit/chihatw.lang-gym.speaker';
import React, { useState } from 'react';
import { Button, TextField } from '@mui/material';
import { SentencePitchLine } from '@chihatw/pitch-line.sentence-pitch-line';
import accentsForPitchesArray from 'accents-for-pitches-array';

import { buildAccents, buildAccentString } from '../../../entities/Accent';
import {
  AssignmentSentence,
  useHandleAssignmentSentences,
} from '../../../services/useAssignmentSentences';

const EditAssignmentPane = ({
  assignmentSentence,
  assignmentDownloadURL,
  callback,
}: {
  assignmentSentence: AssignmentSentence;
  assignmentDownloadURL: string;
  callback: () => void;
}) => {
  const { updateAssignmentSentence } = useHandleAssignmentSentences();

  const [end, setEnd] = useState(assignmentSentence.end);
  const [start, setStart] = useState(assignmentSentence.start);
  const [accentString, setAccentString] = useState(
    buildAccentString(assignmentSentence.accents)
  );
  const onChangeEnd = (end: number) => {
    setEnd(end);
  };

  const onChangeStart = (start: number) => {
    setStart(start);
  };

  const onChangeAccentString = (accentString: string) => {
    setAccentString(accentString);
  };

  const handleClickUpdate = async () => {
    const newAssignmentSentence: AssignmentSentence = {
      ...assignmentSentence,
      end,
      start,
      accents: buildAccents(accentString),
    };
    const { success } = await updateAssignmentSentence(newAssignmentSentence);
    if (success) {
      callback();
    }
  };

  return (
    <div
      style={{
        rowGap: 16,
        display: 'grid',
      }}
    >
      <TextField
        size='small'
        value={accentString}
        label='提出アクセント'
        variant='outlined'
        onChange={(e) => onChangeAccentString(e.target.value)}
        multiline
      />
      <SentencePitchLine
        pitchesArray={accentsForPitchesArray(buildAccents(accentString))}
      />
      <div
        style={{
          display: 'grid',
          columnGap: 16,
          gridTemplateColumns: '32px 80px 80px',
        }}
      >
        <Speaker start={start} end={end} downloadURL={assignmentDownloadURL} />

        <TextField
          variant='outlined'
          size='small'
          label='start'
          value={start}
          type='number'
          onChange={(e) => onChangeStart(Number(e.target.value))}
        />
        <TextField
          variant='outlined'
          size='small'
          label='end'
          value={end}
          type='number'
          onChange={(e) => onChangeEnd(Number(e.target.value))}
        />
      </div>

      <Button variant='contained' onClick={handleClickUpdate}>
        提出アクセント更新
      </Button>
    </div>
  );
};

export default EditAssignmentPane;
