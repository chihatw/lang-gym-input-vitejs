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
import { useQuestionGroups } from './services/useQuestionGroups';
import { useQuestionSets } from './services/useQuestionSets';
import { useQuestions } from './services/useQuestions';
import { useUidOndokus } from './services/useUidOndokus';
import { useArticleSentenceForms } from './services/useArticleSentenceForms';

const App = () => {
  const [articleId, setArticleId] = useState('');
  const [ondokuId, setOndokuId] = useState('');
  const [sentenceId, setSentenceId] = useState('');
  const [workoutId, setWorkoutId] = useState('');
  const [ondokuSentenceId, setOndokuSentenceId] = useState('');
  const [questionSetId, setQuestionSetId] = useState('');
  const [questionGroupId, setQuestionGroupId] = useState('');
  const [questionIds, setQuestionIds] = useState<string[]>([]);

  const { initializing, user, createRhythmsQuestion } = useApp({
    setQuestionSetId,
  });
  const { audioItems } = useAudioItems();
  const { article, articles } = useArticles({
    opened: true,
    articleId,
  });
  const { users } = useUsers({ opened: true });
  const { sentences } = useSentences(articleId);
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
