import React, { useState } from 'react';

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

const App = () => {
  const [articleId, setArticleId] = useState('');
  const [ondokuId, setOndokuId] = useState('');
  const [workoutId, setWorkoutId] = useState('');
  const [isFetching, setIsFetching] = useState(false);
  const [ondokuSentenceId, setOndokuSentenceId] = useState('');
  const { initializing, user, createRhythmsQuestion } = useApp();
  const { audioItems } = useAudioItems();
  const { article, articles } = useArticles({
    opened: true,
    articleId,
  });
  const { users } = useUsers({ opened: true });
  const { sentences } = useSentences({ article });
  const { assignment } = useAssignments(articleId);
  const { ondokuAssignment } = useOndokuAssignments(ondokuId);
  const { assignmentSentences } = useAssignmentSentences(article.id);
  const { sentenceParseNews } = useSentenceParseNews({ article });
  const { workout, workouts } = useWorkouts({ workoutId });
  const { ondoku, ondokus } = useOndokus({ opened: true, ondokuId });
  const { ondokuSentence, ondokuSentences } = useOndokuSentences({
    ondokuId,
    ondokuSentenceId,
  });
  const { ondokuAssignmentSentences } = useOndokuAssignmentSentences(ondokuId);

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
        isFetching,
        assignment,
        initializing,
        sentenceParseNews,
        assignmentSentences,
        ondokuSentence,
        ondokuSentences,
        ondokuAssignment,
        ondokuAssignmentSentences,
        setOndokuId,
        setArticleId,
        setWorkoutId,
        setIsFetching,
        createRhythmsQuestion,
        setOndokuSentenceId,
      }}
    >
      <AppRoutes />
    </AppContext.Provider>
  );
};

export default App;
