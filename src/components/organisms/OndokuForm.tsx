import { Button, FormControlLabel, Switch, TextField } from '@mui/material';
import { MaterialUiPickersDate } from '@material-ui/pickers/typings/date';
import React from 'react';
import {
  KeyboardDatePicker,
  MuiPickersUtilsProvider,
} from '@material-ui/pickers';
import DayJsUtils from '@date-io/dayjs';

const OndokuForm: React.FC<{
  date: Date;
  onSubmit: () => void;
  onPickDate: (date: MaterialUiPickersDate) => void;
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
      <MuiPickersUtilsProvider utils={DayJsUtils}>
        <KeyboardDatePicker
          onChange={onPickDate}
          value={date}
          fullWidth
          label='Created at'
          format='YYYY年M月D日'
        />
      </MuiPickersUtilsProvider>
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
