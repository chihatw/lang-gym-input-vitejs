import React from 'react';

const Tail: React.FC<{ color: string; height?: number }> = ({
  color,
  height,
}) => {
  const borderWidth = Math.floor((height || 32) / 2);
  return (
    <div
      style={{
        width: 0,
        height: 0,
        borderTop: `${borderWidth}px solid transparent`,
        borderLeft: `${borderWidth}px solid ${color}`,
        marginRight: -10,
        borderBottom: `${borderWidth}px solid transparent`,
      }}
    />
  );
};

export default Tail;
