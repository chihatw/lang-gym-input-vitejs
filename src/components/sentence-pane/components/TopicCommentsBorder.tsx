import React from 'react';

const TopicCommentsBorder: React.FC<{
  color: string;
}> = ({ color }) => {
  return (
    <div
      style={{
        display: 'flex',
        flexWrap: 'nowrap',
        justifyContent: 'space-between',
      }}
    >
      <div
        style={{
          width: 30,
          height: 30,
          borderRight: `2px solid ${color}`,
        }}
      />
      <div
        style={{
          width: 30,
          height: 30,
          borderLeft: `2px solid ${color}`,
        }}
      />
    </div>
  );
};

export default TopicCommentsBorder;
