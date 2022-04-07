import React from 'react';
import { Container, Table, TableBody } from '@mui/material';

import ArticleRow from './ArticleRow';
import { Article } from '../../../services/useArticles';
import TablePageHeader from '../../../components/ui/TablePageHeader';

const ArticleListPageComponent = ({
  links,
  articles,
  openPage,
  handleClickDelete,
  handleClickShowParses,
  handleClickShowAccents,
  handleClickShowRecButton,
}: {
  links: { label: string; pathname: string }[];
  articles: Article[];
  openPage: ({ path, article }: { path: string; article: Article }) => void;
  handleClickDelete: (article: Article) => void;
  handleClickShowParses: (article: Article) => void;
  handleClickShowAccents: (article: Article) => void;
  handleClickShowRecButton: (article: Article) => void;
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
              handleClickShowParses={() => handleClickShowParses(article)}
              openArticlePage={() =>
                openPage({ article, path: `${article.id}` })
              }
              openArticleEditPage={() => openPage({ article, path: `` })}
              handleClickShowAccents={() => handleClickShowAccents(article)}
              handleClickShowRecButton={() => handleClickShowRecButton(article)}
            />
          ))}
        </TableBody>
      </Table>
    </div>
  </Container>
);

export default ArticleListPageComponent;
