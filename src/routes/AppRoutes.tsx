import React, { useContext } from 'react';
import { Route, Routes, Navigate } from 'react-router-dom';

import useAudioItems from '../services/useAudioItems';
import { useApp, AppContext } from '../services/app';

import TopPage from '../pages/TopPage';
import SignInPage from '../pages/SignInPage';
import BatchPage from '../pages/BatchPage';
import AudioItemsPage from '../pages/AudioItemsPage';
import OndokuListPage from '../pages/ondoku/OndokuListPage';
import CreateOndokuPage from '../pages/ondoku/CreateOndokuPage';
import EditOndokuPage from '../pages/ondoku/EditOndokuPage';
import EditOndokuSentencePage from '../pages/ondoku/EditOndokuSentencePage';
import InitialOndokuPage from '../pages/ondoku/InitialOndokuPage';
import InitialOndokuVoicePage from '../pages/ondoku/InitialOndokuVoicePage';
import EditOndokuVoicePage from '../pages/ondoku/EditOndokuVoicePage';
import EditOndokuAssignmentVoicePage from '../pages/ondoku/EditOngokuAssignmentVoicePage';
import EditOndokuAssignmentPage from '../pages/ondoku/EditOndokuAssignmentPage';
import OndokuAssignmentPage from '../pages/ondoku/OndokuAssignmentPage';
import OndokuPage from '../pages/ondoku/OndokuPage';
import AccentsQuestionPage from '../pages/accentsQuestion/AccentsQuestionPage';
import AccentsQuestionListPage from '../pages/accentsQuestion/AccentsQuestionListPage';
import RhythmsQuestionListPage from '../pages/rhythmsQuestion/RhythmsQuestionListPage';
import RhythmsQuestionPage from '../pages/rhythmsQuestion/RhythmsQuestionPage';
import SentenceParseListPage from '../pages/sentenceParse/SentenceParseListPage';
import ArticleAssignmentPage from '../pages/article/ArticleAssignmentPage';
import ArticleListPage from '../pages/ArticleListPage';
import ArticlePage from '../pages/article/ArticlePage';
import CreateArticlePage from '../pages/article/CreateArticlePage';
import EditArticleAssignmentPage from '../pages/article/EditArticleAssignmentPage';
import EditArticleAssignmentVoicePage from '../pages/article/EditArticleAssignmentVoicePage';
import EditArticlePage from '../pages/article/EditArticlePage';
import EditArticleVoicePage from '../pages/article/EditArticleVoicePage';
import InitialArticlePage from '../pages/article/InitialArticlePage';
import InitialArticleVoicePage from '../pages/article/InitialArticleVoicePage';
import ArticleInputPage from '../pages/ArticleInputPage';
import EditArticleSentencePage from '../pages/article/EditArticleSentencePage';
import EditSentenceParsePage from '../pages/sentenceParse/EditSentenceParsePage';
import CreateUidOndokuPage from '../pages/uidOndoku/CreateUidOndokuPage';
import UidOndokuListPage from '../pages/uidOndoku/UidOndokuListPage';

const AppRoutes = () => {
  const { initializing, user, onCreateRhythmsQuestion } = useApp();

  const { audioItems, deleteAudioItem } = useAudioItems();
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
              <CreateArticlePage />
            </PrivateRoute>
          }
        />
        <Route path='list' element={<ArticleListPage />} />
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
          path=':id/voice/initial'
          element={
            <PrivateRoute>
              <InitialArticleVoicePage />
            </PrivateRoute>
          }
        />
        <Route
          path=':id/voice'
          element={
            <PrivateRoute>
              <EditArticleVoicePage />
            </PrivateRoute>
          }
        />
        <Route
          path=':id/parse'
          element={
            <PrivateRoute>
              <SentenceParseListPage />
            </PrivateRoute>
          }
        />
        <Route
          path=':id/edit'
          element={
            <PrivateRoute>
              <EditArticlePage />
            </PrivateRoute>
          }
        />
        <Route
          path=':id/assignment/uid/:uid/voice/'
          element={
            <PrivateRoute>
              <EditArticleAssignmentVoicePage />
            </PrivateRoute>
          }
        />
        <Route
          path=':id/assignment/uid/:uid/line/:line'
          element={
            <PrivateRoute>
              <EditArticleAssignmentPage />
            </PrivateRoute>
          }
        />
        <Route path=':id/assignment' element={<ArticleAssignmentPage />} />
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
        <Route
          path=':id'
          element={
            <PrivateRoute>
              <EditArticleSentencePage />
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