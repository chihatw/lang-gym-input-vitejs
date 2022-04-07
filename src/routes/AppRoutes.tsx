import React, { useContext } from 'react';
import { Route, Routes, Navigate } from 'react-router-dom';

import { AppContext } from '../services/app';

import TopPage from '../pages/TopPage';
import BatchPage from '../pages/BatchPage';
import SignInPage from '../pages/SignInPage';
import AudioItemsPage from '../pages/AudioItemsPage';
import ArticleInputPage from '../pages/ArticleInputPage';

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

import ArticlePage from '../pages/article/ArticlePage';
import ArticleListPage from '../pages/ArticleListPage';
import EditArticlePage from '../pages/article/EditArticlePage';
import InitialArticlePage from '../pages/article/InitialArticlePage';
import EditSentenceParsePage from '../pages/EditSentenceParsePage';

import AccentsQuestionPage from '../pages/accentsQuestion/AccentsQuestionPage';
import RhythmsQuestionPage from '../pages/rhythmsQuestion/RhythmsQuestionPage';
import AccentsQuestionListPage from '../pages/accentsQuestion/AccentsQuestionListPage';
import RhythmsQuestionListPage from '../pages/rhythmsQuestion/RhythmsQuestionListPage';

const AppRoutes = () => {
  return (
    <Routes>
      <Route
        path='/'
        element={
          <PrivateRoute>
            <TopPage />
          </PrivateRoute>
        }
      />
      <Route
        path='/batch'
        element={
          <PrivateRoute>
            <BatchPage />
          </PrivateRoute>
        }
      />
      <Route path='/ondoku/*'>
        <Route
          path=''
          element={
            <PrivateRoute>
              <CreateOndokuPage />
            </PrivateRoute>
          }
        />
        <Route
          path='list'
          element={
            <PrivateRoute>
              <OndokuListPage />
            </PrivateRoute>
          }
        />
        <Route
          path='edit/:id'
          element={
            <PrivateRoute>
              <EditOndokuPage />
            </PrivateRoute>
          }
        />
        <Route
          path='sentence/:id'
          element={
            <PrivateRoute>
              <EditOndokuSentencePage />
            </PrivateRoute>
          }
        />
        <Route
          path=':id/initial'
          element={
            <PrivateRoute>
              <InitialOndokuPage />
            </PrivateRoute>
          }
        />
        <Route
          path=':id/voice/initial'
          element={
            <PrivateRoute>
              <InitialOndokuVoicePage />
            </PrivateRoute>
          }
        />
        <Route
          path=':id/voice'
          element={
            <PrivateRoute>
              <EditOndokuVoicePage />
            </PrivateRoute>
          }
        />
        <Route
          path=':id/assignment/uid/:uid/voice/'
          element={
            <PrivateRoute>
              <EditOndokuAssignmentVoicePage />
            </PrivateRoute>
          }
        />
        <Route
          path=':id/assignment/uid/:uid/line/:line'
          element={
            <PrivateRoute>
              <EditOndokuAssignmentPage />
            </PrivateRoute>
          }
        />
        <Route
          path=':id/assignment'
          element={
            <PrivateRoute>
              <OndokuAssignmentPage />
            </PrivateRoute>
          }
        />
        <Route
          path=':id'
          element={
            <PrivateRoute>
              <OndokuPage />
            </PrivateRoute>
          }
        />
      </Route>
      <Route path='/accentsQuestion/*'>
        <Route
          path='list'
          element={
            <PrivateRoute>
              <AccentsQuestionListPage />
            </PrivateRoute>
          }
        />
        <Route
          path=':id'
          element={
            <PrivateRoute>
              <AccentsQuestionPage />
            </PrivateRoute>
          }
        />
      </Route>
      <Route path='/rhythmsQuestion/*'>
        <Route
          path='list'
          element={
            <PrivateRoute>
              <RhythmsQuestionListPage />
            </PrivateRoute>
          }
        />
        <Route
          path=':id'
          element={
            <PrivateRoute>
              <RhythmsQuestionPage />
            </PrivateRoute>
          }
        />
      </Route>
      <Route path='/article/*'>
        <Route
          path=''
          element={
            <PrivateRoute>
              <EditArticlePage />
            </PrivateRoute>
          }
        />
        <Route path='list' element={<ArticleListPage />} />
        {/* 作文入力作業 */}
        <Route
          path='input'
          element={
            <PrivateRoute>
              <ArticleInputPage />
            </PrivateRoute>
          }
        />
        <Route
          path=':id/initial'
          element={
            <PrivateRoute>
              <InitialArticlePage />
            </PrivateRoute>
          }
        />
        <Route
          path=':id'
          element={
            <PrivateRoute>
              <ArticlePage />
            </PrivateRoute>
          }
        />
      </Route>
      <Route path='/sentence/*'>
        <Route
          path=':id/parse'
          element={
            <PrivateRoute>
              <EditSentenceParsePage />
            </PrivateRoute>
          }
        />
      </Route>
      <Route path='/uidOndoku/*'>
        <Route
          path='list'
          element={
            <PrivateRoute>
              <UidOndokuListPage />
            </PrivateRoute>
          }
        />
        <Route path=':id' element={<CreateUidOndokuPage />} />
      </Route>
      <Route
        path='/audioItems'
        element={
          <PrivateRoute>
            <AudioItemsPage />
          </PrivateRoute>
        }
      />
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
