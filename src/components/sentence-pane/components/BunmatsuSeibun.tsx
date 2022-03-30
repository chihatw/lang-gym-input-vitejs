import React from 'react';

const BunmatsuSeibun: React.FC = ({ children }) => {
  return (
    <div
      style={{
        height: '32px',
        border: '1px solid #ccc',
        padding: '6px 10px',
        fontSize: 12,
        boxSizing: 'border-box',
        lineHeight: '20px',
        userSelect: 'none',
        marginLeft: 4,
        whiteSpace: 'nowrap',
      }}
    >
      {children}
    </div>
  );
};

export default BunmatsuSeibun;
