import React from 'react';
import { Card } from '@mui/material';
import accentsForPitchesArray from 'accents-for-pitches-array';

import Original from './Original';
import Assignment from './Assignment';
import { Sentence } from '../../../../entities/Sentence';
import { AssignmentSentence } from '../../../../entities/AssignmentSentence';

const AssignmentCard = ({
  index,
  sentence,
  downloadURL,
  assignmentSentence,
  handleClick,
}: {
  index: number;
  downloadURL: string;
  sentence?: Sentence;
  assignmentSentence: AssignmentSentence;
  handleClick: () => void;
}) => (
  <Card>
    <div
      style={{
        color: '#555',
        rowGap: 16,
        display: 'grid',
        padding: 8,
        fontSize: 12,
      }}
    >
      <Index index={index + 1} />
      <Original
        japanese={sentence?.japanese || ''}
        pitchesArray={accentsForPitchesArray(sentence?.accents || [])}
      />
      <Assignment
        end={assignmentSentence.end}
        start={assignmentSentence.start}
        downloadURL={downloadURL}
        pitchesArray={accentsForPitchesArray(assignmentSentence.accents || [])}
        handleClick={handleClick}
      />
    </div>
  </Card>
);

export default AssignmentCard;

const Index = ({ index }: { index: number }) => <div>{`${index}.`}</div>;
