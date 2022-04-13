import React, { useState } from 'react';

import AppRoutes from './routes/AppRoutes';
import { AppContext, useApp } from './services/app';
import { useArticles } from './services/useArticles';
import { useUsers } from './services/useUsers';
import useAudioItems from './services/useAudioItems';
import { useWorkouts } from './services/useWorkouts';
import { useSentences } from './services/useSentences';
import { useAssignments } from './services/useAssignments';
import { useAssignmentSentences } from './services/useAssignmentSentences';
import { useSentenceParseNews } from './services/useSentenceParseNews';

const App = () => {
  const [articleId, setArticleId] = useState('');
  const [workoutId, setWorkoutId] = useState('');
  const [isFetching, setIsFetching] = useState(false);
  const { initializing, user, createRhythmsQuestion } = useApp();
  const { audioItems, deleteAudioItem } = useAudioItems();
  const { article, articles } = useArticles({
    opened: true,
    articleId,
  });
  const { users } = useUsers({ opened: true });
  const { sentences } = useSentences({ article });
  const { assignment } = useAssignments({ article });
  const { assignmentSentences } = useAssignmentSentences({ article });
  const { sentenceParseNews } = useSentenceParseNews({ article });
  const { workout, workouts } = useWorkouts({ workoutId });
  return (
    <AppContext.Provider
      value={{
        user,
        users,
        article,
        workout,
        articles,
        workouts,
        sentences,
        audioItems,
        isFetching,
        assignment,
        initializing,
        sentenceParseNews,
        assignmentSentences,
        setArticleId,
        setWorkoutId,
        setIsFetching,
        deleteAudioItem,
        createRhythmsQuestion,
      }}
    >
      <AppRoutes />
    </AppContext.Provider>
  );
};

export default App;
