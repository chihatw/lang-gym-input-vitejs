import React from 'react';
import { WorkingMemoryLog } from '../../../../../Model';

const KANAS: { [key: string]: string } = {
  ta: 'タッ',
  taa: 'ター',
  tan: 'タン',
  tata: 'タタ',
  taata: 'タータ',
  tanta: 'タンタ',
  tatata: 'タタタ',
  tatta: 'タッタ',
  tataa: 'タター',
  tatan: 'タタン',
  tatax: 'タタッ',
  ma1: '媽',
  ma2: '麻',
  ma3: '馬',
  ma4: '罵',
  ['0' as string]: '0',
  ['1' as string]: '1',
  ['2' as string]: '2',
  ['3' as string]: '3',
  ['4' as string]: '4',
  ['5' as string]: '5',
  ['6' as string]: '6',
  ['7' as string]: '7',
  ['8' as string]: '8',
  ['9' as string]: '9',
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
  let totalDuration = 0;
  const startAt = log.practice[0].createdAt;
  if (log.practice[index + 1]) {
    duration = log.practice[index + 1].createdAt - practice.createdAt;
    totalDuration = log.practice[index + 1].createdAt - startAt;
  } else if (log.result.createdAt) {
    duration = log.result.createdAt - practice.createdAt;
    totalDuration = log.result.createdAt - startAt;
  }
  duration = Math.round(duration / 100) / 10;
  totalDuration = Math.round(totalDuration / 100) / 10;

  const isIncorrect = !!log.practice[index + log.offset]
    ? log.cueIds[index] !== log.practice[index + log.offset].selected
    : false;

  const minutes = Math.floor(totalDuration / 60);
  const seconds = Math.round(totalDuration % 60);

  return (
    <div key={index} style={{ display: 'flex' }}>
      <div style={{ flexBasis: 16, textAlign: 'right' }}>{index + 1}</div>

      <div
        style={{
          flexBasis: 40,
          textAlign: 'center',
          fontSize: 10,
          color: isIncorrect ? 'red' : 'inherit',
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
          flexBasis: 100,
          textAlign: 'left',
          fontSize: 10,
        }}
      >
        <span>{KANAS[practice.selected]}</span>
        {practice.selected !== log.cueIds[index - log.offset] && (
          <span style={{ color: '#555' }}>{`（○${
            KANAS[log.cueIds[index - log.offset]]
          }）`}</span>
        )}
      </div>
      <div
        style={{
          fontSize: 12,
          flexBasis: 40,
          textAlign: 'right',
          fontFamily: 'monospace',
        }}
      >
        {duration.toFixed(1)}
      </div>
      <div
        style={{
          color: '#555',
          fontSize: 12,
          flexBasis: 80,
          textAlign: 'right',
          fontFamily: 'monospace',
        }}
      >
        {`${minutes}分${String(seconds).padStart(2, '0')}秒`}
      </div>
    </div>
  );
};

export default PracticeTableRow;
