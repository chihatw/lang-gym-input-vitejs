import React from 'react';
import { Button, Container, Table, TableBody, Typography } from '@mui/material';

import ArticleRow from './ArticleRow';
import LinkButton from '../../../../components/ui/LinkButton';
import { Article, State } from '../../../../Model';
import { Action, ActionTypes } from '../../../../Update';
import { useNavigate } from 'react-router-dom';

const ArticleListPageComponent = ({
  state,
  dispatch,
}: {
  state: State;
  dispatch: React.Dispatch<Action>;
}) => {
  const navigate = useNavigate();

  const { articleList } = state;
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
            {articleList.map((article, index) => (
              <ArticleRow
                key={index}
                index={index}
                state={state}
                dispatch={dispatch}
              />
            ))}
          </TableBody>
        </Table>
      </div>
    </Container>
  );
};

export default ArticleListPageComponent;
