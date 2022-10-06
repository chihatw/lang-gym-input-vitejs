import React, { createContext, useEffect, useReducer } from 'react';

import AppRoutes from './AppRoutes';

import { Action, ActionTypes, reducer } from './Update';
import { INITIAL_STATE, State } from './Model';
import { auth } from './repositories/firebase';
import { getUsers } from './services/user';

export const AppContext = createContext<{
  state: State;
  dispatch: React.Dispatch<Action>;
}>({ state: INITIAL_STATE, dispatch: () => {} });

const App = () => {
  const [state, dispatch] = useReducer(reducer, INITIAL_STATE);

  useEffect(() => {
    if (!state.user) return;
    const fetchData = async () => {
      const _users = !!state.users.length ? state.users : await getUsers();
      const updatedState: State = { ...state, users: _users };
      dispatch({ type: ActionTypes.setState, payload: updatedState });
    };
    fetchData();
  }, [state.user]);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      dispatch({ type: ActionTypes.setUser, payload: user });
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const createAudioContext = () => {
      const factory = new AudioContextFactory();
      const _audioContext = factory.create();
      dispatch({ type: ActionTypes.setAudioContext, payload: _audioContext });
      window.removeEventListener('click', createAudioContext);
    };
    if (!state.audioContext) {
      window.addEventListener('click', createAudioContext);
    }
  }, [state.audioContext]);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      <AppRoutes />
    </AppContext.Provider>
  );
};

export default App;

class AudioContextFactory {
  create() {
    console.log('create audioContext');
    const audioContext = new window.AudioContext();
    const osc = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    osc.connect(gainNode);
    gainNode.connect(audioContext.destination);
    gainNode.gain.value = 0;
    osc.start(audioContext.currentTime);
    osc.stop(audioContext.currentTime + 0.1);
    return audioContext;
  }
}
