import React from 'react';
import { Container, Table, TableBody } from '@mui/material';

import ArticleRow from './ArticleRow';
import { Article } from '../../../../services/useArticles';
import TablePageHeader from '../../../ui/TablePageHeader';

const ArticleListPageComponent = ({
  links,
  articles,
  handleClickDelete,
  handleClickShowAccents,
  handleClickShowSentenceParses,
}: {
  links: { label: string; pathname: string }[];
  articles: Article[];
  handleClickDelete: (article: Article) => void;
  handleClickShowAccents: (article: Article) => void;
  handleClickShowSentenceParses: (article: Article) => void;
}) => (
  <Container maxWidth={'sm'} sx={{ paddingTop: 2 }}>
    <div style={{ display: 'grid', rowGap: 16 }}>
      <TablePageHeader label='作文一覧' links={links} />
      <Table>
        <TableBody>
          {articles.map((article, index) => (
            <ArticleRow
              key={index}
              article={article}
              handleClickDelete={() => handleClickDelete(article)}
              handleClickShowAccents={() => handleClickShowAccents(article)}
              handleClickShowSentenceParses={() =>
                handleClickShowSentenceParses(article)
              }
            />
          ))}
        </TableBody>
      </Table>
    </div>
  </Container>
);

export default ArticleListPageComponent;
