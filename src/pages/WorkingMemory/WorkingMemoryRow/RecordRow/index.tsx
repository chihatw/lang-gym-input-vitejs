import React from 'react';
import { WorkingMemoryLog } from '../../../../Model';
import PracticeTable from './PracticeTable';

const RecordRow = ({ log }: { log: WorkingMemoryLog }) => {
  const date = new Date(log.createdAt);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');

  let duration = 0;
  if (log.result.createdAt) {
    duration = log.result.createdAt - log.practice[0].createdAt;
  }
  duration = Math.round(duration / 100) / 10;

  let durationPerPractice = 0;
  if (!!duration) {
    durationPerPractice = duration / log.cueIds.length;
  }

  return (
    <div style={{ display: 'grid', rowGap: 8 }}>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          color: '#52a2aa',
        }}
      >
        <div>{`${year}/${month}/${day} ${hours}:${minutes}`}</div>
        <div>{`前${log.offset}項 正解率:${
          log.correctRatio
        }% 回答時間: ${duration} 秒（平均: ${durationPerPractice.toFixed(
          1
        )}秒）`}</div>
      </div>
      <PracticeTable log={log} />
      <div style={{ color: '#aaa', fontSize: 12 }}>{`${log.result.tappeds.join(
        ', '
      )}`}</div>
    </div>
  );
};

export default RecordRow;
