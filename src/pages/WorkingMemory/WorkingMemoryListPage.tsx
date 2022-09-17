import { Container } from '@mui/material';
import React, { useContext, useEffect, useState } from 'react';
import { AppContext } from '../../App';
import LinkButton from '../../components/ui/LinkButton';
import { State } from '../../Model';
import { getWorkingMemories } from '../../services/workingMemory';
import { ActionTypes } from '../../Update';
import WorkingMemoryRow from './WorkingMemoryRow';

const WorkingMemoryListPage = () => {
  const { state, dispatch } = useContext(AppContext);
  const [initializing, setInitializing] = useState(true);
  useEffect(() => {
    if (!state.users.length) return;
    console.log({ initializing });
    if (!initializing) return;
    const fetchData = async () => {
      const _workingMemories = Object.keys(state.workingMemories).length
        ? state.workingMemories
        : await getWorkingMemories();

      const updatedState: State = {
        ...state,
        isFetching: false,
        workingMemories: _workingMemories,
      };

      dispatch({
        type: ActionTypes.setState,
        payload: updatedState,
      });
      setInitializing(false);
    };
    fetchData();
  }, [initializing, state.users]);
  return (
    <Container maxWidth='sm' sx={{ paddingTop: 2, paddingBottom: 30 }}>
      <div style={{ display: 'grid', rowGap: 16, color: '#555' }}>
        <h2>作業記憶練習一覧</h2>
        <div>
          <LinkButton label={'戻る'} pathname={'/'} />
        </div>
        {Object.values(state.workingMemories)
          .sort((a, b) => b.createdAt - a.createdAt)
          .map((workingMemory, index) => (
            <WorkingMemoryRow workingMemory={workingMemory} key={index} />
          ))}
      </div>
    </Container>
  );
};

export default WorkingMemoryListPage;
