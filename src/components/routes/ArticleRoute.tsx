import React from 'react';
import { Switch } from 'react-router';
import SentenceParseListPage from '../pages/sentenceParse/SentenceParseListPage';
import ArticleAssignmentPage from '../pages/article/ArticleAssignmentPage';
import ArticleListPage from '../pages/article/ArticleListPage';
import ArticlePage from '../pages/article/ArticlePage';
import CreateArticlePage from '../pages/article/CreateArticlePage';
import EditArticleAssignmentPage from '../pages/article/EditArticleAssignmentPage';
import EditArticleAssignmentVoicePage from '../pages/article/EditArticleAssignmentVoicePage';
import EditArticlePage from '../pages/article/EditArticlePage';
import EditArticleVoicePage from '../pages/article/EditArticleVoicePage';
import InitialArticlePage from '../pages/article/InitialArticlePage';
import InitialArticleVoicePage from '../pages/article/InitialArticleVoicePage';
import NoMatch from './NoMatch';
import PrivateRoute from './PrivateRoute';
import ArticleInputPage from '../pages/ArticleInputPage';

const ArticleRoute = () => {
  return (
    <Switch>
      <PrivateRoute exact path='/article' component={CreateArticlePage} />
      <PrivateRoute exact path='/article/list' component={ArticleListPage} />
      <PrivateRoute exact path='/article/input' component={ArticleInputPage} />
      <PrivateRoute
        path='/article/:id/initial'
        component={InitialArticlePage}
      />
      <PrivateRoute
        path='/article/:id/voice/initial'
        component={InitialArticleVoicePage}
      />
      <PrivateRoute
        path='/article/:id/voice'
        component={EditArticleVoicePage}
      />
      <PrivateRoute
        path='/article/:id/parse'
        component={SentenceParseListPage}
      />
      <PrivateRoute path='/article/:id/edit' component={EditArticlePage} />
      <PrivateRoute
        path='/article/:id/assignment/uid/:uid/voice/'
        component={EditArticleAssignmentVoicePage}
      />
      <PrivateRoute
        path='/article/:id/assignment/uid/:uid/line/:line'
        component={EditArticleAssignmentPage}
      />
      <PrivateRoute
        path='/article/:id/assignment'
        component={ArticleAssignmentPage}
      />
      <PrivateRoute path='/article/:id' component={ArticlePage} />
      <NoMatch />
    </Switch>
  );
};

export default ArticleRoute;
