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
import { Article } from '../../../../Model';
import { ActionTypes } from '../../../../Update';
import { useNavigate } from 'react-router-dom';
import { deleteArticle, setArticle } from '../../../../services/article';
import { deleteFile } from '../../../../repositories/file';
import { AppContext } from '../../../../App';

const ArticleRow = ({ index }: { index: number }) => {
  const { state, dispatch } = useContext(AppContext);
  const { articleList } = state;
  const article = articleList[index];
  const { id: articleId, isShowAccents, title, downloadURL } = article;
  const navigate = useNavigate();

  const handleToggleShowAccents = () => {
    if (!dispatch) return;
    dispatch({ type: ActionTypes.toggleIsShowAccents, payload: articleId });
    const newArticle: Article = { ...article, isShowAccents: !isShowAccents };
    setArticle(newArticle);
  };

  const handleDelete = async () => {
    if (!dispatch) return;
    if (window.confirm(`${title}を削除しますか`)) {
      let path = '';
      const header = downloadURL.slice(0, 4);
      if (header === 'http') {
        const audioURL = new URL(downloadURL);
        path = audioURL.pathname.split('/').slice(-1)[0].replace('%2F', '/');
      } else {
        path = downloadURL;
      }
      if (path) {
        deleteFile(path);
      }
      dispatch({ type: ActionTypes.deleteArticle, payload: articleId });
      deleteArticle(articleId);
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
          navigate(`/article/print/${articleId}`);
        }}
      />
      <IconButtonCell
        icon={
          isShowAccents ? (
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
