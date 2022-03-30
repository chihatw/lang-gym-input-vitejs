import React from 'react';

const JuntaiJoshiPane: React.FC<{ label: string }> = ({ label }) => {
  return (
    <div style={{ marginLeft: 4 }}>
      <div
        style={{
          border: `1px solid #52a2aa`,
          display: 'flex',
          padding: 4,
          borderRadius: 4,
        }}
      >
        <div
          style={{
            width: 32,
            height: 35,
            lineHeight: '35px',
            textAlign: 'center',
          }}
        >
          {label}
        </div>
      </div>
    </div>
  );
};

export default JuntaiJoshiPane;
