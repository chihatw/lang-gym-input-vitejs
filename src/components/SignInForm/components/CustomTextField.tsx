import { TextField } from '@mui/material';
import React from 'react';

const CustomTextField: React.FC<{
  label: string;
  value: string;
  error: boolean;
  setValue: (value: string) => void;
  helperText?: string;
  autoComplete: string;
  resetErrMsg?: () => void;
}> = ({
  label,
  value,
  error,
  setValue,
  helperText,
  autoComplete,
  resetErrMsg,
}) => {
  return (
    <TextField
      variant='outlined'
      size='small'
      fullWidth
      type={label}
      label={label}
      value={value}
      error={error}
      onChange={(e) => {
        !!resetErrMsg && resetErrMsg();
        setValue(e.target.value);
      }}
      style={{ color: '#aaa', fontWeight: 500 }}
      helperText={helperText}
      autoComplete={autoComplete}
      required
    />
  );
};

export default CustomTextField;
