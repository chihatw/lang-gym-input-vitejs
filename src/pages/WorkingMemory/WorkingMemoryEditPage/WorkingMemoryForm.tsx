import * as R from 'ramda';
import {
  Button,
  Container,
  FormControlLabel,
  FormGroup,
  MenuItem,
  Select,
  Switch,
  TextField,
} from '@mui/material';
import React, { useContext } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { AppContext } from '../../../App';
import { WorkingMemoryFormState } from './Model';
import { State, WorkingMemory, WorkingMemoryLog } from '../../../Model';
import { setWorkingMemory } from '../../../services/workingMemory';
import { ActionTypes } from '../../../Update';

const WorkingMemoryForm = ({
  state,
  dispatch,
}: {
  state: WorkingMemoryFormState;
  dispatch: React.Dispatch<WorkingMemoryFormState>;
}) => {
  const { workoutId } = useParams();
  const navigate = useNavigate();
  const { state: appState, dispatch: appDispatch } = useContext(AppContext);

  const handleBack = () => {
    navigate('/memory/list');
  };

  const handleChangeBaseCueCount = (baseCueCount: number) => {
    const updatedState: WorkingMemoryFormState = { ...state, baseCueCount };
    dispatch(updatedState);
  };

  const handleChangeCueIdsStr = (cueIdsStr: string) => {
    const updatedState: WorkingMemoryFormState = { ...state, cueIdsStr };
    dispatch(updatedState);
  };

  const handleChangeIsActive = (isActive: boolean) => {
    const updatedState: WorkingMemoryFormState = { ...state, isActive };
    dispatch(updatedState);
  };

  const handleChangeOffset = (offset: number) => {
    const updatedState: WorkingMemoryFormState = { ...state, offset };
    dispatch(updatedState);
  };

  const handleChangeStep = (step: number) => {
    const updatedState: WorkingMemoryFormState = { ...state, step };
    dispatch(updatedState);
  };

  const handleChangeTitle = (title: string) => {
    const updatedState: WorkingMemoryFormState = { ...state, title };
    dispatch(updatedState);
  };

  const handleChangeUid = (uid: string) => {
    const updatedState: WorkingMemoryFormState = { ...state, uid };
    dispatch(updatedState);
  };

  const handleSubmit = () => {
    let createdAt = Date.now();
    let logs: { [id: string]: WorkingMemoryLog } = {};
    if (!!workoutId) {
      createdAt = appState.workingMemories[workoutId].createdAt;
      logs = appState.workingMemories[workoutId].logs;
    }
    const workingMemory: WorkingMemory = {
      id: state.id,
      uid: state.uid,
      logs,
      step: state.step,
      title: state.title,
      cueIds: state.cueIdsStr.split('\n').filter((i) => i),
      offset: state.offset,
      isActive: state.isActive,
      createdAt,
      baseCueCount: state.baseCueCount,
    };
    // remote
    setWorkingMemory(workingMemory);
    // local
    const updatedState = R.assocPath<WorkingMemory, State>(
      ['workingMemories', workingMemory.id],
      workingMemory
    )(appState);
    appDispatch({ type: ActionTypes.setState, payload: updatedState });
    navigate('/memory/list');
  };

  return (
    <Container maxWidth='sm' sx={{ paddingTop: 2, paddingBottom: 20 }}>
      <div style={{ display: 'grid', rowGap: 16 }}>
        <h2>ワーキングメモリー</h2>
        <div>
          <Button variant='contained' onClick={handleBack}>
            戻る
          </Button>
        </div>
        <TextField
          value={state.title}
          size='small'
          label='title'
          onChange={(e) => handleChangeTitle(e.target.value)}
        />
        <Select
          size='small'
          value={state.uid}
          variant='standard'
          onChange={(e) => handleChangeUid(e.target.value)}
        >
          {appState.users.map((user) => (
            <MenuItem key={user.id} value={user.id}>
              {user.displayname}
            </MenuItem>
          ))}
        </Select>
        <TextField
          size='small'
          multiline
          rows={4}
          value={state.cueIdsStr}
          label='cueIdsStr'
          onChange={(e) => handleChangeCueIdsStr(e.target.value)}
        />
        <TextField
          label='baseCueCount'
          value={state.baseCueCount}
          size='small'
          type='number'
          onChange={(e) => handleChangeBaseCueCount(Number(e.target.value))}
        />
        <FormGroup>
          <FormControlLabel
            control={
              <Switch
                checked={state.isActive}
                onChange={(e) => handleChangeIsActive(e.target.checked)}
              />
            }
            label='isActive'
          />
        </FormGroup>
        <TextField
          label='offset'
          value={state.offset}
          size='small'
          type='number'
          onChange={(e) => handleChangeOffset(Number(e.target.value))}
        />
        <TextField
          label='step'
          value={state.step}
          size='small'
          type='number'
          onChange={(e) => handleChangeStep(Number(e.target.value))}
        />
        <Button variant='contained' onClick={handleSubmit}>
          {!!workoutId ? '更新' : '新規'}
        </Button>
      </div>
    </Container>
  );
};

export default WorkingMemoryForm;
