import React from 'react';
import { WorkingMemoryAnswerLog } from '../../../../Model';

const LogRow = ({
  log,
  index,
  answer,
  listening,
}: {
  log: WorkingMemoryAnswerLog;
  index: number;
  answer: string;
  listening: string;
}) => {
  return (
    <div style={{ display: 'flex', alignItems: 'center', fontSize: 12 }}>
      <div style={{ flexBasis: 24 }}>{index + 1}</div>
      <div style={{ flexGrow: 1, display: 'grid', rowGap: 0 }}>
        <div
          style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 60px)' }}
        >
          <div>{`正解:${answer}`}</div>
          <div>{`播放: ${listening}`}</div>
          <div>{`${log.duration} 秒`}</div>
        </div>

        <div style={{ display: 'flex' }}>
          <div style={{ flexBasis: 60 }}>Tapped:</div>
          <div>
            {Object.values(log.tapped).map((item, index) => {
              const isLast = index === Object.values(log.tapped).length - 1;
              const isWrong = isLast && item !== answer;
              return (
                <span key={index}>
                  <span
                    style={{
                      color: isLast ? (isWrong ? 'red' : 'inherit') : '#ccc',
                    }}
                  >
                    {item}
                  </span>
                  {!isLast && <span>, </span>}
                </span>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LogRow;
