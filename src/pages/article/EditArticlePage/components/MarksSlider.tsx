import { Slider } from '@mui/material';
import React, { useEffect, useState } from 'react';

const MarksSlider = ({
  superValue,
  superHandleChangeValue,
}: {
  superValue?: number;
  superHandleChangeValue?: (value: number) => void;
}) => {
  const [value, setValue] = useState(700);
  useEffect(() => {
    if (!superValue) return;
    setValue(superValue);
  }, [superValue]);

  const handleChangeValue = (value: number) => {
    setValue(value);
    !!superHandleChangeValue && superHandleChangeValue(value);
  };

  return (
    <div
      style={{
        padding: '0 16px',
        background: '#eee',
        borderRadius: 4,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <div style={{ color: '#555' }}>{value}</div>
        <div
          style={{
            padding: 8,
            flexBasis: 200,
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <Slider
            min={400}
            max={1200}
            value={value}
            onChange={(e, value) => {
              typeof value === 'number' && handleChangeValue(value);
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default MarksSlider;
