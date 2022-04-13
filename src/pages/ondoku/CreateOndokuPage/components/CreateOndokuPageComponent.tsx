import AdapterDateFns from '@mui/lab/AdapterDateFns';
import React from 'react';
import { LocalizationProvider, MobileDatePicker } from '@mui/lab';
import { Button, FormControlLabel, Switch, TextField } from '@mui/material';
import TableLayout from '../../../../components/templates/TableLayout';

const CreateOndokuPageComponent = ({
  date,
  title,
  downloadURL,
  isShowAccents,
  setTitle,
  onSubmit,
  onPickDate,
  setDownloadURL,
  onToggleShowAccents,
}: {
  date: Date | null;
  onPickDate: (value: Date | null) => void;
  isShowAccents: boolean;
  onToggleShowAccents: () => void;
  title: string;
  setTitle: (value: string) => void;
  downloadURL: string;
  setDownloadURL: (value: string) => void;
  onSubmit: () => void;
}) => (
  <TableLayout title='音読作成' backURL='/ondoku/list'>
    <div style={{ display: 'grid', rowGap: 16 }}>
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
      <TextField
        variant='outlined'
        size='small'
        fullWidth
        label={'title'}
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <TextField
        variant='outlined'
        size='small'
        fullWidth
        label={'downloadURL'}
        value={downloadURL}
        multiline
        rows={5}
        onChange={(e) => setDownloadURL(e.target.value)}
      />

      <Button
        variant='contained'
        color='primary'
        fullWidth
        style={{ fontWeight: 500, fontFamily: '"M PLUS Rounded 1c"' }}
        onClick={onSubmit}
      >
        作成
      </Button>
    </div>
  </TableLayout>
);

export default CreateOndokuPageComponent;
