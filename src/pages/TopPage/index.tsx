import React from 'react';
import { Button, Container } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { auth } from '../../repositories/firebase';

const TopPage = () => {
  const navigate = useNavigate();
  const itemsArray: { label: string; onClick: () => void }[][] = [
    [
      { label: '作文一覧', onClick: () => navigate('/article/list') },
      { label: '作文処理', onClick: () => navigate('/article/input') },
    ],
    [
      {
        label: 'アクセント問題一覧',
        onClick: () => navigate('/accentsQuestion/list'),
      },
      {
        label: 'リズム問題一覧',
        onClick: () => navigate('/rhythmsQuestion/list'),
      },
    ],
    [
      { label: '練習一覧', onClick: () => navigate('/workouts') },
      { label: 'audioItems', onClick: () => navigate('/audioItems') },
    ],
    [{ label: 'Sign Out', onClick: () => auth.signOut() }],
  ];
  return (
    <Container maxWidth='sm'>
      <div style={{ paddingTop: 16 }}>
        <VersionPane>{`ver. 1.2.0`}</VersionPane>
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

const RowBorder: React.FC<{ children: React.ReactNode }> = ({ children }) => {
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

const VersionPane: React.FC<{ children: React.ReactNode }> = ({ children }) => {
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
