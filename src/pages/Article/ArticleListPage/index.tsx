import { Button, Container, Table, TableBody, Typography } from '@mui/material';
import React, { useContext, useEffect } from 'react';
import { State } from '../../../Model';
import { Action, ActionTypes } from '../../../Update';
import { getArticles } from '../../../services/article';
import LinkButton from '../../../components/ui/LinkButton';
import { useNavigate } from 'react-router-dom';
import ArticleRow from './components/ArticleRow';
import { AppContext } from '../../../App';

const ArticleListPage = () => {
  const { state, dispatch } = useContext(AppContext);
  const navigate = useNavigate();
  const { isFetching, articleList } = state;
  useEffect(() => {
    if (!isFetching || !dispatch) return;
    const fetchData = async () => {
      const _articleList = !!articleList.length
        ? articleList
        : await getArticles();
      dispatch({ type: ActionTypes.setArticleList, payload: _articleList });
    };
    fetchData();
  }, [isFetching]);

  return (
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
              onClick={() => {
                if (!dispatch) return;
                navigate('/article/initial');
                dispatch({ type: ActionTypes.initialArticle });
              }}
            >
              新規作成
            </Button>
          </div>
        </div>
        <Table>
          <TableBody>
            {articleList.map((_, index) => (
              <ArticleRow key={index} index={index} />
            ))}
          </TableBody>
        </Table>
      </div>
    </Container>
  );
};

export default ArticleListPage;
