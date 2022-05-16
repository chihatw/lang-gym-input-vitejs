import React from 'react';
import { SentencePitchLine } from '@chihatw/pitch-line.sentence-pitch-line';
import string2PitchesArray from 'string2pitches-array';
import { WorkoutItem } from 'workout-items';

const WorkoutItemRow = ({
  index,
  workoutItem,
}: {
  index: number;
  workoutItem: WorkoutItem;
}) => {
  return (
    <div style={{ display: 'grid', rowGap: 4 }}>
      <div style={{ fontSize: 12 }}>{`${index + 1}.`}</div>
      <div style={{ fontSize: 14 }}>{workoutItem.text}</div>
      <div style={{ fontSize: 12, color: '#555' }}>{workoutItem.chinese}</div>
      <SentencePitchLine
        pitchesArray={string2PitchesArray(workoutItem.pitchesArray)}
      />
    </div>
  );
};

export default WorkoutItemRow;
