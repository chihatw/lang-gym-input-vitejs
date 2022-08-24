import * as R from 'ramda';
import EditIcon from '@mui/icons-material/Edit';
import React, { useContext } from 'react';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityOffOutlinedIcon from '@mui/icons-material/VisibilityOffOutlined';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import SubjectIcon from '@mui/icons-material/Subject';
import { TableRow, TableCell } from '@mui/material';

import TitleDateCell from './TitleDateCell';
import IconButtonCell from './IconButtonCell';
import PrintIcon from '@mui/icons-material/Print';
import { Article, State } from '../../../../Model';
import { ActionTypes } from '../../../../Update';
import { useNavigate } from 'react-router-dom';
import { deleteArticle, setArticle } from '../../../../services/article';
import { deleteFile } from '../../../../repositories/file';
import { AppContext } from '../../../../App';

const ArticleRow = ({ article }: { article: Article }) => {
  const { state, dispatch } = useContext(AppContext);

  const navigate = useNavigate();

  const handleToggleShowAccents = () => {
    if (!dispatch) return;

    const updatedArticle: Article = {
      ...article,
      isShowAccents: !article.isShowAccents,
    };

    const updatedState = R.assocPath<Article, State>(
      ['articles', article.id],
      updatedArticle
    )(state);

    dispatch({ type: ActionTypes.setState, payload: updatedState });

    setArticle(updatedArticle);
  };

  const handleDelete = async () => {
    if (!dispatch) return;
    if (window.confirm(`${article.title}を削除しますか`)) {
      let path = '';
      const header = article.downloadURL.slice(0, 4);
      if (header === 'http') {
        const audioURL = new URL(article.downloadURL);
        path = audioURL.pathname.split('/').slice(-1)[0].replace('%2F', '/');
      } else {
        path = article.downloadURL;
      }
      if (path) {
        deleteFile(path);
      }

      const updatedState = R.dissocPath<State>(['articles', article.id])(state);
      dispatch({ type: ActionTypes.setState, payload: updatedState });
      deleteArticle(article.id);
    }
  };

  return (
    <TableRow>
      <TableCell padding='none' sx={{ whiteSpace: 'nowrap' }}>
        {article.userDisplayname}
      </TableCell>
      <TitleDateCell title={article.title} createdAt={article.createdAt} />
      <IconButtonCell
        icon={<EditIcon />}
        onClick={() => {
          if (!dispatch) return;
          dispatch({ type: ActionTypes.startFetching });
          navigate(`/article/edit/${article.id}`);
        }}
      />
      <IconButtonCell
        icon={<SubjectIcon />}
        onClick={() => {
          if (!dispatch) return;
          dispatch({ type: ActionTypes.startFetching });
          navigate(`/article/${article.id}`);
        }}
      />
      <IconButtonCell
        icon={<PrintIcon />}
        onClick={() => {
          if (!dispatch) return;
          dispatch({ type: ActionTypes.startFetching });
          navigate(`/article/print/${article.id}`);
        }}
      />
      <IconButtonCell
        icon={
          article.isShowAccents ? (
            <VisibilityOutlinedIcon />
          ) : (
            <VisibilityOffOutlinedIcon />
          )
        }
        onClick={handleToggleShowAccents}
      />
      <IconButtonCell icon={<DeleteIcon />} onClick={handleDelete} />
    </TableRow>
  );
};

export default ArticleRow;
