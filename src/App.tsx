import React, { useEffect, useReducer, useState } from 'react';

import AppRoutes from './routes/AppRoutes';
import { AppContext, useApp } from './services/app';
import { useQuestionGroups } from './services/useQuestionGroups';
import { useQuestionSets } from './services/useQuestionSets';
import { useQuestions } from './services/useQuestions';
import { reducer } from './Update';
import { INITIAL_STATE } from './Model';

const App = () => {
  const [state, dispatch] = useReducer(reducer, INITIAL_STATE);
  const [questionSetId, setQuestionSetId] = useState('');
  const [questionGroupId, setQuestionGroupId] = useState('');
  const [questionIds, setQuestionIds] = useState<string[]>([]);
  const [audioContext, setAudioContext] = useState<AudioContext | null>(null);

  const { initializing, user, createRhythmsQuestion } = useApp({
    setQuestionSetId,
  });

  const { questionSet } = useQuestionSets({
    questionSetId,
    setQuestionGroupId,
  });
  const { questionGroup } = useQuestionGroups({
    questionGroupId,
    setQuestionIds,
  });
  const { questions } = useQuestions({ questionIds, questionGroupId });

  useEffect(() => {
    const createAudioContext = () => {
      const factory = new AudioContextFactory();
      const _audioContext = factory.create();
      setAudioContext(_audioContext);
      window.removeEventListener('click', createAudioContext);
    };
    if (!audioContext) {
      window.addEventListener('click', createAudioContext);
    }
  }, [audioContext]);

  return (
    <AppContext.Provider
      value={{
        user,
        initializing,
        questionSet,
        questionGroup,
        questions,
        audioContext,
        setQuestionSetId,
        createRhythmsQuestion,
      }}
    >
      <AppRoutes state={state} dispatch={dispatch} />
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
