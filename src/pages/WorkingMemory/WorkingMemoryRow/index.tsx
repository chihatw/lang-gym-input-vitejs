import * as R from 'ramda';
import Delete from '@mui/icons-material/Delete';
import Edit from '@mui/icons-material/Edit';
import LockIcon from '@mui/icons-material/Lock';
import { Button, Card, CardContent, IconButton } from '@mui/material';
import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../../../App';
import { State, WorkingMemory } from '../../../Model';
import { deleteWorkingMemory } from '../../../services/workingMemory';
import LastLog from './LastLog';
import RecordRow from './RecordRow';
import { ActionTypes } from '../../../Update';

const WorkingMemoryRow = ({
  workingMemory,
}: {
  workingMemory: WorkingMemory;
}) => {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const { state, dispatch } = useContext(AppContext);

  const handleClick = () => {
    navigate(`/memory/${workingMemory.id}`);
  };

  const handleDelete = () => {
    if (window.confirm('delete?')) {
      // remote
      deleteWorkingMemory(workingMemory.id);

      // local
      const updatedState = R.dissocPath<State>([
        'workingMemories',
        workingMemory.id,
      ])(state);
      dispatch({ type: ActionTypes.setState, payload: updatedState });
    }
  };

  return (
    <Card>
      <CardContent>
        <div
          style={{
            display: 'grid',
            rowGap: 8,
            fontSize: 14,
            marginBottom: -8,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <div style={{ flexBasis: 80 }}>
              {state.users.find((item) => item.id === workingMemory.uid)
                ?.displayname || ''}
            </div>
            <div style={{ flexGrow: 1, display: 'flex', alignItems: 'center' }}>
              <span>{workingMemory.title}</span>
              {!workingMemory.isActive && <LockIcon sx={{ color: '#ccc' }} />}
            </div>
            <IconButton onClick={handleClick}>
              <Edit sx={{ color: '#aaa' }} />
            </IconButton>
            <IconButton onClick={handleDelete}>
              <Delete sx={{ color: '#aaa' }} />
            </IconButton>

            <Button size='small' onClick={() => setOpen(!open)}>
              {open ? 'hide' : 'open'}
            </Button>
          </div>
          {Object.keys(workingMemory.logs).length && (
            <LastLog workingMemory={workingMemory} />
          )}
          {open && (
            <div style={{ display: 'grid', rowGap: 16, paddingLeft: 8 }}>
              {Object.values(workingMemory.logs)
                .sort((a, b) => b.createdAt - a.createdAt)
                .map((log, index) => (
                  <RecordRow key={index} log={log} />
                ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default WorkingMemoryRow;
