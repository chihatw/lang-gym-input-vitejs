import { Card, CardContent } from '@mui/material';
import React, { useContext } from 'react';
import { AppContext } from '../../../App';
import { WorkingMemory } from '../../../Model';
import RecordRow from './RecordRow';

const WorkingMemoryRow = ({
  workingMemory,
}: {
  workingMemory: WorkingMemory;
}) => {
  const { state } = useContext(AppContext);
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
          <div style={{ display: 'flex' }}>
            <div style={{ flexBasis: 80 }}>
              {state.users.find((item) => item.id === workingMemory.uid)
                ?.displayname || ''}
            </div>
            <div>{workingMemory.title}</div>
          </div>
          <div style={{ display: 'grid', rowGap: 16, paddingLeft: 8 }}>
            {Object.values(workingMemory.logs)
              .sort((a, b) => a.createdAt - b.createdAt)
              .map((log, index) => (
                <RecordRow key={index} log={log} />
              ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default WorkingMemoryRow;
