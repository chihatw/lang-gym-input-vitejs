import React from 'react';
import { Redirect, useRouteMatch } from 'react-router';
import {
  SentenceParseListPageContext,
  useSentenceParseListPage,
} from './services/sentenceParseListPage';
import SentenceParseList from './components/SentenceParseList';
import { Container } from '@mui/material';
import TableLayoutHeader from '../../../organisms/TableLayoutHeader';

const SentenceParseListPage = () => {
  const match = useRouteMatch<{ id: string }>();
  const {
    marks,
    onCopy,
    article,
    onBatch,
    setMarks,
    onSubmit,
    sentences,
    initializing,
    explanationStr,
    setExplanationStr,
    sentenceParseNews,
  } = useSentenceParseListPage(match.params.id);
  if (initializing) {
    return <></>;
  } else {
    if (article) {
      return (
        <SentenceParseListPageContext.Provider
          value={{
            marks,
            onCopy,
            article,
            onBatch,
            setMarks,
            onSubmit,
            sentences,
            explanationStr,
            sentenceParseNews,
            setExplanationStr,
          }}
        >
          <Container maxWidth='md'>
            <div style={{ margin: '32px 0 160px' }}>
              <TableLayoutHeader
                title={article.title}
                backURL='/article/list'
              />
              <div style={{ height: 16 }} />
              <div>
                <SentenceParseList />
              </div>
            </div>
          </Container>
        </SentenceParseListPageContext.Provider>
      );
    } else {
      return <Redirect to='/article/list' />;
    }
  }
};

export default SentenceParseListPage;
