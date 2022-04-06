import React from 'react';
import { Container } from '@mui/material';

import SentenceRow from './SentenceRow';
import { Article } from '../../../../services/useArticles';
import { Sentence } from '../../../../entities/Sentence';
import TableLayoutHeader from '../../../../components/organisms/TableLayoutHeader';
import { SentenceParseNew } from '../../../../entities/SentenceParseNew';

const SentenceParseListPageComponent = ({
  article,
  sentences,
  sentenceParseNews,
  onCopy,
  openEditPage,
}: {
  article: Article;
  sentences: Sentence[];
  sentenceParseNews: { [key: string]: SentenceParseNew };
  onCopy: (value: number) => void;
  openEditPage: (value: string) => void;
}) => (
  <Container maxWidth='md' sx={{ paddingTop: 4, paddingBottom: 20 }}>
    <div style={{ display: 'grid', rowGap: 16 }}>
      <TableLayoutHeader title={article.title} backURL='/article/list' />
      <div
        style={{
          height: 1000,
          border: '1px solid #ddd',
          overflowY: 'scroll',
          borderRadius: 4,
        }}
      >
        {sentences.map((sentence, index) => (
          <SentenceRow
            key={index}
            index={index}
            hasNext={!!sentences[index + 1]}
            sentence={sentence}
            sentenceParseNew={sentenceParseNews[sentence.id]}
            onCopy={() => onCopy(index)}
            openEditPage={() => openEditPage(sentence.id)}
          />
        ))}
        <div style={{ height: 400 }} />
      </div>
    </div>
  </Container>
);

export default SentenceParseListPageComponent;
