import * as R from 'ramda';
import ClearIcon from '@mui/icons-material/Clear';
import { IconButton } from '@mui/material';
import React, { useContext } from 'react';
import { AppContext } from '../../../App';
import { State, WorkingMemory } from '../../../Model';
import { setWorkingMemory } from '../../../services/workingMemory';
import { ActionTypes } from '../../../Update';

const LastLog = ({ workingMemory }: { workingMemory: WorkingMemory }) => {
  const { state, dispatch } = useContext(AppContext);

  const lastLog = Object.values(workingMemory.logs).sort(
    (a, b) => b.createdAt - a.createdAt
  )[0];
  const date = new Date(lastLog.createdAt);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  let duration = lastLog.result.createdAt - lastLog.practice[0].createdAt;
  duration = Math.round(duration / 100) / 10;

  const handleClearLogs = () => {
    if (window.confirm('clear logs?')) {
      const updatedWorkingMemory: WorkingMemory = {
        ...workingMemory,
        logs: {},
      };
      // remote
      setWorkingMemory(updatedWorkingMemory);

      // local
      const updatedState = R.assocPath<WorkingMemory, State>(
        ['workingMemories', workingMemory.id],
        updatedWorkingMemory
      )(state);
      dispatch({ type: ActionTypes.setState, payload: updatedState });
    }
  };

  return (
    <div style={{ display: 'flex', alignItems: 'center' }}>
      <div style={{ display: 'grid', rowGap: 2, flexGrow: 1 }}>
        <div
          style={{
            display: 'flex',
            fontSize: 8,
            color: '#aaa',
          }}
        >
          <div style={{ flexBasis: 80 }} />
          <div style={{ flexBasis: 40, textAlign: 'center' }}>offset</div>
          <div style={{ flexBasis: 40, textAlign: 'center' }}>count</div>
          <div style={{ flexBasis: 40, textAlign: 'center' }}>ratio</div>
          <div style={{ flexBasis: 60, textAlign: 'center' }}>duration</div>
        </div>
        <div style={{ display: 'flex' }}>
          <div style={{ flexBasis: 80 }}>{`${year}/${month}/${day}`}</div>
          <div style={{ flexBasis: 40, textAlign: 'center' }}>
            {lastLog.offset}
          </div>
          <div style={{ flexBasis: 40, textAlign: 'center' }}>
            {lastLog.cueIds.length}
          </div>
          <div style={{ flexBasis: 40, textAlign: 'center' }}>
            {lastLog.correctRatio}
          </div>
          <div style={{ flexBasis: 60, textAlign: 'right' }}>
            {`${duration.toFixed(1)}秒`}
          </div>
        </div>
      </div>
      <IconButton onClick={handleClearLogs}>
        <ClearIcon />
      </IconButton>
    </div>
  );
};

export default LastLog;
