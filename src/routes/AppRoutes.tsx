import React, { useContext } from 'react';
import { Route, Routes, Navigate } from 'react-router-dom';

import { AppContext } from '../services/app';

import TopPage from '../pages/TopPage';
import SignInPage from '../pages/SignInPage';
import ArticleInputPage from '../pages/ArticleInputPage';

import WorkoutPage from '../pages/Workout/WorkoutPage';
import WorkoutsPage from '../pages/Workout/WorkoutsPage';

import ArticleListPage from '../pages/Article/ArticleListPage';
import EditArticlePage from '../pages/Article/EditArticlePage';
import EditSentenceParsePage from '../pages/Article/EditSentenceParsePage';

import AccentsQuestionPage from '../pages/Question/accentsQuestion/AccentsQuestionPage';
import RhythmsQuestionPage from '../pages/Question/rhythmsQuestion/RhythmsQuestionPage';
import AccentsQuestionListPage from '../pages/Question/accentsQuestion/AccentsQuestionListPage';
import RhythmsQuestionListPage from '../pages/Question/rhythmsQuestion/RhythmsQuestionListPage';
import ArticlePage from '../pages/Article/ArticlePage';
import EditArticleSentenceFormPane from '../pages/Article/EditArticleSentenceFormPage';
import PrintPitchesPage from '../pages/Article/PrintPitchesPage';

const AppRoutes = () => {
  return (
    <Routes>
      <Route path='/' element={<TopPage />} />
      <Route path='/workout' element={<WorkoutPage />} />
      <Route path='/workouts' element={<WorkoutsPage />} />

      {/* accentsQuestion */}

      <Route path='/accentsQuestion/*'>
        <Route path='list' element={<AccentsQuestionListPage />} />
        <Route path=':id' element={<AccentsQuestionPage />} />
      </Route>

      {/* rhythmsQuestion */}

      <Route path='/rhythmsQuestion/*'>
        <Route path='list' element={<RhythmsQuestionListPage />} />
        <Route path=':id' element={<RhythmsQuestionPage />} />
      </Route>

      {/* article */}
      <Route path='/article/*'>
        <Route path='list' element={<ArticleListPage />} />
        {/* 作文入力作業 */}
        <Route path='input' element={<ArticleInputPage />} />
        <Route path='print/:id' element={<PrintPitchesPage />} />
        <Route path=':id' element={<ArticlePage />} />
        <Route path='' element={<EditArticlePage />} />
      </Route>

      {/* parse */}
      <Route path='/parse/:index' element={<EditSentenceParsePage />} />

      {/* form */}
      <Route path='/form/:index' element={<EditArticleSentenceFormPane />} />

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
  const { user, initializing } = useContext(AppContext);
  return !initializing ? user ? <Navigate to='/' /> : children : <></>;
};

export default AppRoutes;
