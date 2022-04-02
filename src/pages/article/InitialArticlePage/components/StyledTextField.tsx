import { TextField } from '@mui/material';
import React, { useState } from 'react';

const StyledTextField = ({
  label,
  superHandleChange,
}: {
  label: string;
  superHandleChange: (value: string) => void;
}) => {
  const [input, setInput] = useState('');
  const handleInput = (input: string) => {
    setInput(input);
    superHandleChange(input);
  };
  return (
    <TextField
      rows={5}
      size='small'
      label={label}
      value={input}
      variant='outlined'
      multiline
      onChange={(e) => handleInput(e.target.value)}
    />
  );
};

export default StyledTextField;
