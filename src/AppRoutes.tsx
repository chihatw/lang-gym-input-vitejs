import React, { useContext } from 'react';
import { Route, Routes, Navigate } from 'react-router-dom';

import TopPage from './pages/TopPage';
import SignInPage from './pages/SignInPage';
import ArticleInputPage from './pages/ArticleInputPage';

import WorkoutPage from './pages/Workout/WorkoutPage';
import WorkoutListPage from './pages/Workout/WorkoutListPage';

import ArticleListPage from './pages/Article/ArticleListPage';
import EditArticlePage from './pages/Article/EditArticlePage';

import PitchQuizPage from './pages/Quiz/PitchQuizPage';
import RhythmQuizPage from './pages/Quiz/RhythmQuizPage';
import QuizListPage from './pages/Quiz/QuizListPage';
import ArticlePage from './pages/Article/ArticlePage';
import PrintPitchesPage from './pages/Article/PrintPitchesPage';
import RandomWorkoutList from './pages/RandomWorkout/RandomWorkoutListPage';
import RandomWorkoutEdit from './pages/RandomWorkout/RandomWorkoutEdit';
import { AppContext } from './App';
import TempPage from './pages/TempPage';
import WorkingMemoryListPage from './pages/WorkingMemory/WorkingMemoryListPage';

const AppRoutes = () => {
  return (
    <Routes>
      <Route path='/' element={<TopPage />} />

      {/* article */}
      <Route path='/article'>
        <Route path=':articleId' element={<ArticlePage />} />
        <Route path='initial' element={<EditArticlePage />} />
        <Route path='edit/:articleId' element={<EditArticlePage />} />
        <Route path='list' element={<ArticleListPage />} />
        {/* 作文入力作業 */}
        <Route path='input' element={<ArticleInputPage />} />
        <Route path='print/:articleId' element={<PrintPitchesPage />} />
      </Route>

      {/* workout */}
      <Route path='/workout'>
        <Route index element={<WorkoutPage />} />
        <Route path=':workoutId' element={<WorkoutPage />} />
      </Route>

      <Route path='/workouts' element={<WorkoutListPage />} />

      {/* Random Workout */}
      <Route path='/random'>
        <Route path='list' element={<RandomWorkoutList />} />
        <Route path='new' element={<RandomWorkoutEdit />} />
        <Route path=':workoutId' element={<RandomWorkoutEdit />} />
      </Route>

      {/* WorkingMemory */}
      <Route path='/memory'>
        <Route path='list' element={<WorkingMemoryListPage />} />
      </Route>

      {/* Quiz */}

      <Route path='/quiz/*'>
        <Route path='list' element={<QuizListPage />} />
        <Route path='pitch/:quizId' element={<PitchQuizPage />} />
        <Route path='rhythm/:quizId' element={<RhythmQuizPage />} />
      </Route>

      <Route path='/temp' element={<TempPage />} />

      <Route
        path='/login'
        element={
          <GuestRoute>
            <SignInPage />
          </GuestRoute>
        }
      />
      <Route path='*' element={<Navigate to='/' />} />
    </Routes>
  );
};

const GuestRoute = ({ children }: { children: JSX.Element }) => {
  const { state } = useContext(AppContext);
  return !state.initializing ? (
    state.user ? (
      <Navigate to='/' />
    ) : (
      children
    )
  ) : (
    <></>
  );
};

export default AppRoutes;
