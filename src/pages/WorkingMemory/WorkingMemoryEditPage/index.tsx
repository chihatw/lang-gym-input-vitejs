import { nanoid } from 'nanoid';
import React, { useContext, useEffect, useReducer } from 'react';
import { useParams } from 'react-router-dom';
import { AppContext } from '../../../App';
import { buildWorkingMemoryFormState } from '../../../services/workingMemory';
import { WorkingMemoryFormState } from './Model';
import WorkingMemoryForm from './WorkingMemoryForm';

const reducer = (
  state: WorkingMemoryFormState,
  action: WorkingMemoryFormState
) => action;

const INITIAL_WORKING_MEMORY_FORM_STATE: WorkingMemoryFormState = {
  id: nanoid(8),
  baseCueCount: 4,
  cueIdsStr: '',
  isActive: true,
  offset: 1,
  step: 1,
  title: '',
  uid: '',
};

const WorkingMemoryEditPage = () => {
  const { workoutId } = useParams();
  const { state } = useContext(AppContext);
  const [formState, formDispatch] = useReducer(
    reducer,
    INITIAL_WORKING_MEMORY_FORM_STATE
  );

  useEffect(() => {
    if (!state.users.length) return;
    if (workoutId) {
      const workingMemory = state.workingMemories[workoutId];
      const formState = buildWorkingMemoryFormState(workingMemory);
      formDispatch(formState);
      return;
    }

    const formState = {
      ...INITIAL_WORKING_MEMORY_FORM_STATE,
      uid: state.users[0].id,
    };
    formDispatch(formState);
  }, [workoutId, state.users]);
  if (!formState.uid) return <></>;
  return <WorkingMemoryForm state={formState} dispatch={formDispatch} />;
};

export default WorkingMemoryEditPage;
