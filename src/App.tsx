import React, { useContext } from 'react';
import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';

import { useApp, AppContext } from './services/app';
import TopPage from './components/pages/TopPage';
import SignInPage from './components/pages/SignInPage';
import BatchPage from './components/pages/BatchPage';
import AudioItemsPage from './components/pages/AudioItemsPage';
import useAudioItems from './services/useAudioItems';
import OndokuListPage from './components/pages/ondoku/OndokuListPage';
import CreateOndokuPage from './components/pages/ondoku/CreateOndokuPage';
import EditOndokuPage from './components/pages/ondoku/EditOndokuPage';
import EditOndokuSentencePage from './components/pages/ondoku/EditOndokuSentencePage';
import InitialOndokuPage from './components/pages/ondoku/InitialOndokuPage';
import InitialOndokuVoicePage from './components/pages/ondoku/InitialOndokuVoicePage';
import EditOndokuVoicePage from './components/pages/ondoku/EditOndokuVoicePage';
import EditOndokuAssignmentVoicePage from './components/pages/ondoku/EditOngokuAssignmentVoicePage';
import EditOndokuAssignmentPage from './components/pages/ondoku/EditOndokuAssignmentPage';
import OndokuAssignmentPage from './components/pages/ondoku/OndokuAssignmentPage';
import OndokuPage from './components/pages/ondoku/OndokuPage';
import AccentsQuestionPage from './components/pages/accentsQuestion/AccentsQuestionPage';
import AccentsQuestionListPage from './components/pages/accentsQuestion/AccentsQuestionListPage';
import RhythmsQuestionListPage from './components/pages/rhythmsQuestion/RhythmsQuestionListPage';
import RhythmsQuestionPage from './components/pages/rhythmsQuestion/RhythmsQuestionPage';
import SentenceParseListPage from './components/pages/sentenceParse/SentenceParseListPage';
import ArticleAssignmentPage from './components/pages/article/ArticleAssignmentPage';
import ArticleListPage from './components/pages/ArticleListPage';
import ArticlePage from './components/pages/article/ArticlePage';
import CreateArticlePage from './components/pages/article/CreateArticlePage';
import EditArticleAssignmentPage from './components/pages/article/EditArticleAssignmentPage';
import EditArticleAssignmentVoicePage from './components/pages/article/EditArticleAssignmentVoicePage';
import EditArticlePage from './components/pages/article/EditArticlePage';
import EditArticleVoicePage from './components/pages/article/EditArticleVoicePage';
import InitialArticlePage from './components/pages/article/InitialArticlePage';
import InitialArticleVoicePage from './components/pages/article/InitialArticleVoicePage';
import ArticleInputPage from './components/pages/ArticleInputPage';
import EditArticleSentencePage from './components/pages/article/EditArticleSentencePage';
import EditSentenceParsePage from './components/pages/sentenceParse/EditSentenceParsePage';
import CreateUidOndokuPage from './components/pages/uidOndoku/CreateUidOndokuPage';
import UidOndokuListPage from './components/pages/uidOndoku/UidOndokuListPage';

const App = () => {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
};

export default App;

const AppContent = () => {
  const { initializing, user, onCreateRhythmsQuestion } = useApp();

  const { audioItems, deleteAudioItem } = useAudioItems();
  return (
    <AppContext.Provider
      value={{
        user,
        initializing,
        audioItems,
        deleteAudioItem,
        onCreateRhythmsQuestion,
      }}
    >
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
          <Route
            path='list'
            element={
              <PrivateRoute>
                <ArticleListPage />
              </PrivateRoute>
            }
          />
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
          <Route
            path=':id/assignment'
            element={
              <PrivateRoute>
                <ArticleAssignmentPage />
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
    </AppContext.Provider>
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
