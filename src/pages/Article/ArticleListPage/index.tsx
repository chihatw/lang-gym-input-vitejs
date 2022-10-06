import { Button, Container, Table, TableBody, Typography } from '@mui/material';
import React, { useContext, useEffect, useState } from 'react';
import { State } from '../../../Model';
import { ActionTypes } from '../../../Update';
import { getArticles } from '../../../services/article';
import LinkButton from '../../../components/ui/LinkButton';
import { useNavigate } from 'react-router-dom';
import ArticleRow from './components/ArticleRow';
import { AppContext } from '../../../App';

const ArticleListPage = () => {
  const { state, dispatch } = useContext(AppContext);
  const navigate = useNavigate();
  const [initializing, setInitializing] = useState(true);
  useEffect(() => {
    if (!state.users.length || !initializing) return;
    const fetchData = async () => {
      const articles =
        Object.keys(state.articles).length > 1
          ? state.articles
          : await getArticles();
      const updatedState: State = {
        ...state,
        articles,
      };
      dispatch({ type: ActionTypes.setState, payload: updatedState });
      setInitializing(false);
    };
    fetchData();
  }, [initializing, state.users]);

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
                const updatedState: State = {
                  ...state,
                  isFetching: true,
                };
                dispatch({ type: ActionTypes.setState, payload: updatedState });
              }}
            >
              新規作成
            </Button>
          </div>
        </div>
        <Table>
          <TableBody>
            {Object.values(state.articles)
              .sort((a, b) => b.createdAt - a.createdAt)
              .map((article, index) => (
                <ArticleRow key={index} article={article} />
              ))}
          </TableBody>
        </Table>
      </div>
    </Container>
  );
};

export default ArticleListPage;
