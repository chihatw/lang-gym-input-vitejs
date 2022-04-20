import React from 'react';

const BranchBorder: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  return (
    <div
      style={{
        border: '1px solid yellowgreen',
        padding: 4,
        borderRadius: 4,
      }}
    >
      {children}
    </div>
  );
};

export default BranchBorder;
