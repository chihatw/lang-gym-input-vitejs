import React, { useContext } from 'react';
import { Route, Routes, Navigate } from 'react-router-dom';

import TopPage from './pages/TopPage';
import SignInPage from './pages/SignInPage';
import ArticleInputPage from './pages/ArticleInputPage';

import WorkoutPage from './pages/Workout/WorkoutPage';
import WorkoutListPage from './pages/Workout/WorkoutListPage';

import ArticleListPage from './pages/Article/ArticleListPage';
import EditArticlePage from './pages/Article/EditArticlePage';

import AccentQuizPage from './pages/Quiz/AccentQuizPage';
import RhythmQuizPage from './pages/Quiz/RhythmQuizPage';
import QuizListPage from './pages/Quiz/QuizListPage';
import ArticlePage from './pages/Article/ArticlePage';
import EditArticleSentenceFormPane from './pages/Article/EditArticleSentenceFormPage';
import PrintPitchesPage from './pages/Article/PrintPitchesPage';
import RandomWorkoutList from './pages/RandomWorkout/RandomWorkoutListPage';
import RandomWorkoutEdit from './pages/RandomWorkout/RandomWorkoutEdit';
import { AppContext } from './App';
import TempPage from './pages/TempPage';

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

      {/* Quiz */}

      <Route path='/quiz/*'>
        <Route path='list' element={<QuizListPage />} />
        <Route path='accent/:quizId' element={<AccentQuizPage />} />
        <Route path='rhythm/:quizId' element={<RhythmQuizPage />} />
      </Route>

      {/* form */}
      <Route
        path='/form/:articleId/index/:index'
        element={<EditArticleSentenceFormPane />}
      />

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
  const { initializing, user } = state;
  return !initializing ? user ? <Navigate to='/' /> : children : <></>;
};

export default AppRoutes;
