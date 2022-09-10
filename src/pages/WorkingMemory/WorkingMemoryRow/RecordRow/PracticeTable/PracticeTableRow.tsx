import React from 'react';
import { WorkingMemoryLog } from '../../../../../Model';

const KANAS: { [key: string]: string } = {
  ta: 'タッ',
  taa: 'ター',
  tan: 'タン',
  tata: 'タタ',
};

const PracticeTableRow = ({
  log,
  index,
}: {
  log: WorkingMemoryLog;
  index: number;
}) => {
  const practice = log.practice[index];
  let duration = 0;
  if (log.practice[index + 1]) {
    duration = log.practice[index + 1].createdAt - practice.createdAt;
  } else if (log.result.createdAt) {
    duration = log.result.createdAt - practice.createdAt;
  }
  duration = Math.round(duration / 100) / 10;

  const isIncorrect = practice.selected !== log.cueIds[index - log.offset];

  return (
    <div key={index} style={{ display: 'flex' }}>
      <div style={{ flexBasis: 16, textAlign: 'right' }}>{index + 1}</div>

      <div
        style={{
          flexBasis: 40,
          textAlign: 'center',
          fontSize: 10,
        }}
      >
        {KANAS[log.cueIds[index]]}
      </div>
      <div
        style={{
          flexBasis: 40,
          textAlign: 'center',
        }}
      >
        {practice.playedAts.length}
      </div>
      <div
        style={{
          flexBasis: 72,
          textAlign: 'left',
          color: isIncorrect ? 'red' : 'inherit',
          fontSize: 10,
        }}
      >
        <span>{KANAS[practice.selected]}</span>
        {isIncorrect && (
          <span style={{ color: '#555' }}>{`（○${
            KANAS[log.cueIds[index - log.offset]]
          }）`}</span>
        )}
      </div>
      <div style={{ flexBasis: 40, textAlign: 'right' }}>
        {duration.toFixed(1)}
      </div>
    </div>
  );
};

export default PracticeTableRow;
