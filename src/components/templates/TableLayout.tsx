import { Container } from '@mui/material';
import React from 'react';
import TableLayoutHeader from '../organisms/TableLayoutHeader';

const TableLayout: React.FC<{
  title: string;
  backURL?: string;
  onCreate?: () => void;
  maxWidth?: 'sm' | 'xs' | 'md' | 'lg' | 'xl';
  children: React.ReactNode;
}> = ({ children, title, backURL = '/', onCreate, maxWidth }) => {
  return (
    <Container maxWidth={maxWidth || 'sm'}>
      <div style={{ margin: '32px 0 160px' }}>
        <TableLayoutHeader
          title={title}
          backURL={backURL}
          onCreate={onCreate}
        />
        <div style={{ height: 16 }} />
        <div>{children}</div>
      </div>
    </Container>
  );
};

export default TableLayout;
