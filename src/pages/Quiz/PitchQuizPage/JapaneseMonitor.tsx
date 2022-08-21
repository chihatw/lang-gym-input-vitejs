import React from 'react';

// アクセント問題で使用
const JapaneseMonitor = ({ japanese }: { japanese: string }) => {
  return (
    <div
      style={{
        color: '#555',
        rowGap: 8,
        padding: '0 16px',
        display: 'grid',
        fontSize: 12,
        fontFamily: '"M PLUS Rounded 1c"',
      }}
    >
      {japanese.split('\n').map((line, index) => (
        <div key={index}>{`${index}: ${line}`}</div>
      ))}
    </div>
  );
};

export default JapaneseMonitor;
