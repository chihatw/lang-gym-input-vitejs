import React from 'react';
import { WorkingMemoryAnswer } from '../../../../Model';
import LogRow from './LogRow';

const RecordRow = ({ answer }: { answer: WorkingMemoryAnswer }) => {
  const date = new Date(answer.createdAt);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
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
        <div>{`前${answer.offset}項 正解率:${answer.correctRatio}% 回答時間: ${answer.duration} 秒`}</div>
      </div>
      <div style={{ display: 'grid', rowGap: 8, paddingLeft: 8 }}>
        {Object.values(answer.log).map((log, index) => (
          <LogRow
            index={index}
            log={log}
            key={index}
            answer={answer.cueIds[index]}
            listening={answer.cueIds[index + answer.offset] || '--'}
          />
        ))}
      </div>
    </div>
  );
};

export default RecordRow;
