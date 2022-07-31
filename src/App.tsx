import React, { useEffect, useReducer, useState } from 'react';

import AppRoutes from './routes/AppRoutes';
import { AppContext, useApp } from './services/app';
import { useArticles } from './services/useArticles';
import { useUsers } from './services/useUsers';
import { useAudioItems } from './services/useAudioItems';
import { useWorkouts } from './services/useWorkouts';
import { useSentences } from './services/useSentences';
import { useAssignments } from './services/useAssignments';
import { useAssignmentSentences } from './services/useAssignmentSentences';
import { useSentenceParseNews } from './services/useSentenceParseNews';
import { useOndokus } from './services/useOndokus';
import { useOndokuSentences } from './services/useOndokuSentences';
import { useOndokuAssignments } from './services/useOndokuAssignments';
import { useOndokuAssignmentSentences } from './services/useOndokuAssignmentSentences';
import { useQuestionGroups } from './services/useQuestionGroups';
import { useQuestionSets } from './services/useQuestionSets';
import { useQuestions } from './services/useQuestions';
import { useUidOndokus } from './services/useUidOndokus';
import { useArticleSentenceForms } from './services/useArticleSentenceForms';
import { reducer } from './Update';
import { INITIAL_STATE } from './Model';

const App = () => {
  const [state, dispatch] = useReducer(reducer, INITIAL_STATE);
  const [articleId, setArticleId] = useState('');
  const [ondokuId, setOndokuId] = useState('');
  const [sentenceId, setSentenceId] = useState('');
  const [workoutId, setWorkoutId] = useState('');
  const [ondokuSentenceId, setOndokuSentenceId] = useState('');
  const [questionSetId, setQuestionSetId] = useState('');
  const [questionGroupId, setQuestionGroupId] = useState('');
  const [questionIds, setQuestionIds] = useState<string[]>([]);
  const [audioContext, setAudioContext] = useState<AudioContext | null>(null);

  const { initializing, user, createRhythmsQuestion } = useApp({
    setQuestionSetId,
  });
  const { audioItems } = useAudioItems();
  const { article, articles } = useArticles({
    opened: true,
    articleId,
  });
  const { users } = useUsers({ opened: true });
  const { sentences, assignmentBlobs } = useSentences(articleId);
  const { assignment } = useAssignments(articleId);
  const { ondokuAssignment } = useOndokuAssignments(ondokuId);
  const { assignmentSentences } = useAssignmentSentences(articleId);
  const { sentenceParseNew, sentenceParseNews } = useSentenceParseNews({
    articleId,
    sentenceId,
  });
  const { articleSentenceForms } = useArticleSentenceForms(articleId);
  const { workout, workouts } = useWorkouts({ workoutId });
  const { ondoku, ondokus } = useOndokus({ opened: true, ondokuId });
  const { ondokuSentence, ondokuSentences } = useOndokuSentences({
    ondokuId,
    ondokuSentenceId,
  });
  const { ondokuAssignmentSentences } = useOndokuAssignmentSentences(ondokuId);
  const { accentsQuestionSets, rhythmsQuestionSets, questionSet } =
    useQuestionSets({ questionSetId, setQuestionGroupId });
  const { questionGroup } = useQuestionGroups({
    questionGroupId,
    setQuestionIds,
  });
  const { questions } = useQuestions({ questionIds, questionGroupId });
  const { uidOndokus } = useUidOndokus();

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
        users,
        article,
        ondoku,
        ondokus,
        workout,
        articles,
        workouts,
        sentences,
        audioItems,
        assignment,
        initializing,
        sentenceParseNew,
        sentenceParseNews,
        assignmentSentences,
        ondokuSentence,
        ondokuSentences,
        ondokuAssignment,
        ondokuAssignmentSentences,
        accentsQuestionSets,
        rhythmsQuestionSets,
        questionSet,
        questionGroup,
        questions,
        uidOndokus,
        articleSentenceForms,
        assignmentBlobs,
        audioContext,
        setOndokuId,
        setArticleId,
        setWorkoutId,
        setQuestionSetId,
        createRhythmsQuestion,
        setOndokuSentenceId,
        setSentenceId,
      }}
    >
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
