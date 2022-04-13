import React, { useContext } from 'react';
import { Route, Routes, Navigate } from 'react-router-dom';

import { AppContext } from '../services/app';

import TopPage from '../pages/TopPage';
import BatchPage from '../pages/BatchPage';
import SignInPage from '../pages/SignInPage';
import AudioItemsPage from '../pages/AudioItemsPage';
import ArticleInputPage from '../pages/ArticleInputPage';

import WorkoutPage from '../pages/Workout/WorkoutPage';
import WorkoutsPage from '../pages/Workout/WorkoutsPage';
import UidOndokuListPage from '../pages/uidOndoku/UidOndokuListPage';
import CreateUidOndokuPage from '../pages/uidOndoku/CreateUidOndokuPage';

import OndokuPage from '../pages/ondoku/OndokuPage';
import OndokuListPage from '../pages/ondoku/OndokuListPage';
import EditOndokuPage from '../pages/ondoku/EditOndokuPage';
import CreateOndokuPage from '../pages/ondoku/CreateOndokuPage';
import InitialOndokuPage from '../pages/ondoku/InitialOndokuPage';
import EditOndokuVoicePage from '../pages/ondoku/EditOndokuVoicePage';
import OndokuAssignmentPage from '../pages/ondoku/OndokuAssignmentPage';
import InitialOndokuVoicePage from '../pages/ondoku/InitialOndokuVoicePage';
import EditOndokuSentencePage from '../pages/ondoku/EditOndokuSentencePage';
import EditOndokuAssignmentPage from '../pages/ondoku/EditOndokuAssignmentPage';
import EditOndokuAssignmentVoicePage from '../pages/ondoku/EditOngokuAssignmentVoicePage';

import ArticleListPage from '../pages/Article/ArticleListPage';
import EditArticlePage from '../pages/Article/EditArticlePage';
import EditSentenceParsePage from '../pages/Article/EditSentenceParsePage';

import AccentsQuestionPage from '../pages/Question/accentsQuestion/AccentsQuestionPage';
import RhythmsQuestionPage from '../pages/Question/rhythmsQuestion/RhythmsQuestionPage';
import AccentsQuestionListPage from '../pages/Question/accentsQuestion/AccentsQuestionListPage';
import RhythmsQuestionListPage from '../pages/Question/rhythmsQuestion/RhythmsQuestionListPage';

const AppRoutes = () => {
  return (
    <Routes>
      <Route path='/' element={<TopPage />} />
      <Route path='/batch' element={<BatchPage />} />
      <Route path='/workout' element={<WorkoutPage />} />
      <Route path='/workouts' element={<WorkoutsPage />} />

      {/* ondoku */}

      <Route path='/ondoku/*'>
        <Route path='' element={<CreateOndokuPage />} />
        <Route path='list' element={<OndokuListPage />} />
        <Route path='edit/:id' element={<EditOndokuPage />} />
        <Route path='sentence/:id' element={<EditOndokuSentencePage />} />
        <Route path=':id/initial' element={<InitialOndokuPage />} />
        <Route path=':id/voice/initial' element={<InitialOndokuVoicePage />} />
        <Route path=':id/voice' element={<EditOndokuVoicePage />} />
        <Route
          path=':id/assignment/uid/:uid/voice/'
          element={<EditOndokuAssignmentVoicePage />}
        />
        <Route
          path=':id/assignment/uid/:uid/line/:line'
          element={<EditOndokuAssignmentPage />}
        />
        <Route path=':id/assignment' element={<OndokuAssignmentPage />} />
        <Route path=':id' element={<OndokuPage />} />
      </Route>

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
        <Route path='' element={<EditArticlePage />} />
      </Route>

      {/* parse */}
      <Route path='/parse/:index' element={<EditSentenceParsePage />} />

      <Route path='/uidOndoku/*'>
        <Route path='list' element={<UidOndokuListPage />} />
        <Route path=':id' element={<CreateUidOndokuPage />} />
      </Route>
      <Route path='/audioItems' element={<AudioItemsPage />} />
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
const PrivateRoute = ({ children }: { children: JSX.Element }) => {
  const { user, initializing } = useContext(AppContext);
  return !initializing ? user ? children : <Navigate to='/login' /> : <></>;
};

const GuestRoute = ({ children }: { children: JSX.Element }) => {
  const { user, initializing } = useContext(AppContext);
  return !initializing ? user ? <Navigate to='/' /> : children : <></>;
};

export default AppRoutes;
