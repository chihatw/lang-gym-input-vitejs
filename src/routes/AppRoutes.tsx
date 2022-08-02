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

import AccentsQuestionPage from '../pages/Question/accentsQuestion/AccentsQuestionPage';
import RhythmsQuestionPage from '../pages/Question/rhythmsQuestion/RhythmsQuestionPage';
import AccentsQuestionListPage from '../pages/Question/accentsQuestion/AccentsQuestionListPage';
import RhythmsQuestionListPage from '../pages/Question/rhythmsQuestion/RhythmsQuestionListPage';
import ArticlePage from '../pages/Article/ArticlePage';
import EditArticleSentenceFormPane from '../pages/Article/EditArticleSentenceFormPage';
import PrintPitchesPage from '../pages/Article/PrintPitchesPage';
import { State } from '../Model';
import { Action } from '../Update';

const AppRoutes = ({
  state,
  dispatch,
}: {
  state: State;
  dispatch: React.Dispatch<Action>;
}) => {
  return (
    <Routes>
      <Route path='/' element={<TopPage state={state} dispatch={dispatch} />} />

      {/* article */}
      <Route path='/article'>
        <Route
          path=':articleId'
          element={<ArticlePage state={state} dispatch={dispatch} />}
        />
        <Route
          path='initial'
          element={<EditArticlePage state={state} dispatch={dispatch} />}
        />
        <Route
          path='edit/:articleId'
          element={<EditArticlePage state={state} dispatch={dispatch} />}
        />
        <Route
          path='list'
          element={<ArticleListPage state={state} dispatch={dispatch} />}
        />
        {/* 作文入力作業 */}
        <Route
          path='input'
          element={<ArticleInputPage state={state} dispatch={dispatch} />}
        />
        <Route
          path='print/:articleId'
          element={<PrintPitchesPage state={state} dispatch={dispatch} />}
        />
      </Route>
      <Route path='/workout'>
        <Route
          index
          element={<WorkoutPage state={state} dispatch={dispatch} />}
        />
        <Route
          path=':workoutId'
          element={<WorkoutPage state={state} dispatch={dispatch} />}
        />
      </Route>
      <Route
        path='/workouts'
        element={<WorkoutsPage state={state} dispatch={dispatch} />}
      />

      {/* accentsQuestion */}

      <Route path='/accentsQuestion/*'>
        <Route
          path='list'
          element={
            <AccentsQuestionListPage state={state} dispatch={dispatch} />
          }
        />
        <Route
          path=':id'
          element={<AccentsQuestionPage state={state} dispatch={dispatch} />}
        />
      </Route>

      {/* rhythmsQuestion */}

      <Route path='/rhythmsQuestion/*'>
        <Route
          path='list'
          element={
            <RhythmsQuestionListPage state={state} dispatch={dispatch} />
          }
        />
        <Route
          path=':id'
          element={<RhythmsQuestionPage state={state} dispatch={dispatch} />}
        />
      </Route>

      {/* form */}
      <Route
        path='/form/:index'
        element={
          <EditArticleSentenceFormPane state={state} dispatch={dispatch} />
        }
      />

      <Route
        path='/login'
        element={
          <GuestRoute>
            <SignInPage state={state} dispatch={dispatch} />
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
