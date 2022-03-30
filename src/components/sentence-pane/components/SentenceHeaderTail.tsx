import React from 'react';
import Tail from './Tail';

const SentenceHeaderTail: React.FC<{
  isTaigendome: boolean;
  headerHeight: number;
  color: string;
}> = ({ children, isTaigendome, headerHeight, color }) => {
  if (!isTaigendome) {
    return (
      <div
        style={{
          display: 'flex',
          flexWrap: 'nowrap',
          color: '#555',
        }}
      >
        <div>{children}</div>
        <Tail color={color} height={headerHeight} />
      </div>
    );
  } else {
    return <div>{children}</div>;
  }
};

export default SentenceHeaderTail;
