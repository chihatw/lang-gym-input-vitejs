import React from 'react';
import { Button, Container, Table, TableBody, Typography } from '@mui/material';

import ArticleRow from './ArticleRow';
import { Article } from '../../../../services/useArticles';
import LinkButton from '../../../../components/ui/LinkButton';

const ArticleListPageComponent = ({
  articles,
  openPage,
  handleClickDelete,
  handleClickShowParses,
  handleClickShowAccents,
  handleClickShowRecButton,
  handleClickOpenCreateArticlePage,
}: {
  articles: Article[];
  openPage: ({ path, article }: { path: string; article: Article }) => void;
  handleClickDelete: (article: Article) => void;
  handleClickShowParses: (article: Article) => void;
  handleClickShowAccents: (article: Article) => void;
  handleClickShowRecButton: (article: Article) => void;
  handleClickOpenCreateArticlePage: () => void;
}) => (
  <Container maxWidth={'sm'} sx={{ paddingTop: 2 }}>
    <div style={{ display: 'grid', rowGap: 16 }}>
      <div style={{ display: 'grid', rowGap: 16 }}>
        <Typography variant='h5'>{'作文一覧'}</Typography>
        <div>
          <LinkButton label={'戻る'} pathname={'/'} />
        </div>
        <div>
          <Button
            variant='contained'
            onClick={handleClickOpenCreateArticlePage}
          >
            新規作成
          </Button>
        </div>
      </div>
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
