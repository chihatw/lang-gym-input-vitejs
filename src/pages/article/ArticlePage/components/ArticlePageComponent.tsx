import React from 'react';

import TableLayout from '../../../../components/templates/TableLayout';
import { Article } from '../../../../services/useArticles';
import { Sentence } from '../../../../entities/Sentence';
import ArticleSentenceList from './ArticleSentenceList';

const ArticlePageComponent = ({
  article,
  openPage,
  sentences,
  onCreateAccentsQuestion,
  onCreateRhythmsQuestion,
}: {
  article: Article;
  sentences: Sentence[];
  openPage: ({ path, sentence }: { path: string; sentence: Sentence }) => void;
  onCreateAccentsQuestion: () => void;
  onCreateRhythmsQuestion: () => void;
}) => (
  <TableLayout title={article.title} backURL={`/article/list`}>
    <ArticleSentenceList
      article={article}
      sentences={sentences}
      openPage={openPage}
      onCreateAccentsQuestion={onCreateAccentsQuestion}
      onCreateRhythmsQuestion={onCreateRhythmsQuestion}
    />
  </TableLayout>
);

export default ArticlePageComponent;
