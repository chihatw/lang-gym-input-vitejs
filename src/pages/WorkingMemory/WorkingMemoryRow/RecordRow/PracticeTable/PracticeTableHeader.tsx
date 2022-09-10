import React from 'react';

const PracticeTableHeader = () => {
  return (
    <div style={{ display: 'flex' }}>
      <div style={{ flexBasis: 16 }} />
      <div
        style={{
          flexBasis: 40,
          textAlign: 'center',
          fontSize: 10,
        }}
      >
        聲音
      </div>
      <div
        style={{
          flexBasis: 40,
          textAlign: 'center',
          fontSize: 10,
        }}
      >
        播放
      </div>
      <div
        style={{
          flexBasis: 72,
          textAlign: 'center',
          fontSize: 10,
        }}
      >
        選擇
      </div>
      <div style={{ flexBasis: 40, textAlign: 'right', fontSize: 10 }}>
        経過
      </div>
    </div>
  );
};

export default PracticeTableHeader;
