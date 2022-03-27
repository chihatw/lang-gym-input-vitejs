import React from 'react';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import MobileDatePicker from '@mui/lab/MobileDatePicker';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import { Button, FormControlLabel, Switch, TextField } from '@mui/material';

const OndokuForm: React.FC<{
  date: Date;
  onSubmit: () => void;
  onPickDate: (date: Date | null) => void;
  isShowAccents: boolean;
  textFieldItems: {
    label: string;
    value: string;
    rows: number;
    onChange: (text: string) => void;
  }[];
  submitButtonLabel: string;
  onToggleShowAccents: () => void;
}> = ({
  date,
  onSubmit,
  onPickDate,
  isShowAccents,
  textFieldItems,
  submitButtonLabel,
  onToggleShowAccents,
}) => {
  return (
    <div>
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <MobileDatePicker
          label='Created at'
          inputFormat='yyyy年MM月dd日'
          value={date}
          onChange={onPickDate}
          renderInput={(params) => (
            <TextField {...params} size='small' fullWidth />
          )}
        />
      </LocalizationProvider>
      <div style={{ height: 16 }} />
      <FormControlLabel
        label='isShowAccents'
        control={
          <Switch
            checked={isShowAccents}
            color='primary'
            onChange={onToggleShowAccents}
          />
        }
      />
      <div style={{ height: 16 }} />
      {textFieldItems.map((item, index) => (
        <div key={index}>
          <TextField
            variant='outlined'
            size='small'
            fullWidth
            label={item.label}
            value={item.value}
            multiline={item.rows > 1}
            rows={item.rows}
            onChange={(e) => item.onChange(e.target.value)}
          />
          <div style={{ height: 16 }} />
        </div>
      ))}

      <Button
        variant='contained'
        color='primary'
        fullWidth
        style={{ fontWeight: 500, fontFamily: '"M PLUS Rounded 1c"' }}
        onClick={onSubmit}
      >
        {submitButtonLabel}
      </Button>
    </div>
  );
};

export default OndokuForm;
