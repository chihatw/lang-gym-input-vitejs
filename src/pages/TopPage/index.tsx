import React from 'react';
import { Button, Container } from '@mui/material';
import { useTopPage } from './services/topPage';

const TopPage = () => {
  const { itemsArray } = useTopPage();
  return (
    <Container maxWidth='sm'>
      <div style={{ paddingTop: 16 }}>
        <VersionPane>{`ver. 1.1.2`}</VersionPane>
        <div style={{ height: 4 }} />
        {itemsArray.map((row, rowIndex) => (
          <div key={rowIndex}>
            <RowBorder>
              <div style={{ display: 'flex' }}>
                {row.map((item, columnIndex) => (
                  <div key={columnIndex}>
                    <div style={{ display: 'flex' }}>
                      <Button variant='contained' onClick={item.onClick}>
                        {item.label}
                      </Button>
                      {!!row[columnIndex + 1] && <div style={{ width: 16 }} />}
                    </div>
                  </div>
                ))}
              </div>
            </RowBorder>
            {!!itemsArray[rowIndex + 1] && <div style={{ height: 16 }} />}
          </div>
        ))}
      </div>
    </Container>
  );
};

export default TopPage;

const RowBorder: React.FC = ({ children }) => {
  return (
    <div
      style={{
        border: '1px solid #ccc',
        borderRadius: 4,
        padding: '8px',
      }}
    >
      {children}
    </div>
  );
};

const VersionPane: React.FC = ({ children }) => {
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'flex-end',
        fontSize: 8,
        color: '#aaa',
        padding: '0 8px',
      }}
    >
      {children}
    </div>
  );
};
