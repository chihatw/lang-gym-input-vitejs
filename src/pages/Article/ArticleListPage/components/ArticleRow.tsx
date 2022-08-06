import EditIcon from '@mui/icons-material/Edit';
import React from 'react';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityOffOutlinedIcon from '@mui/icons-material/VisibilityOffOutlined';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import SubjectIcon from '@mui/icons-material/Subject';
import FlashOnIcon from '@mui/icons-material/FlashOn';
import FlashOffIcon from '@mui/icons-material/FlashOff';
import { TableRow, TableCell } from '@mui/material';

import TitleDateCell from './TitleDateCell';
import IconButtonCell from './IconButtonCell';
import PrintIcon from '@mui/icons-material/Print';
import { Article, State } from '../../../../Model';
import { Action, ActionTypes } from '../../../../Update';
import { useNavigate } from 'react-router-dom';
import { deleteArticle, setArticle } from '../../../../services/article';
import { deleteFile } from '../../../../repositories/file';

const ArticleRow = ({
  index,
  state,
  dispatch,
}: {
  index: number;
  state: State;
  dispatch: React.Dispatch<Action>;
}) => {
  const { articleList } = state;
  const article = articleList[index];
  const {
    id: articleId,
    isShowParse,
    isShowAccents,
    title,
    downloadURL,
  } = article;
  const navigate = useNavigate();

  const handleToggleShowAccents = () => {
    dispatch({ type: ActionTypes.toggleIsShowAccents, payload: articleId });
    const newArticle: Article = { ...article, isShowAccents: !isShowAccents };
    setArticle(newArticle);
  };

  const handleToggleShowParses = () => {
    dispatch({ type: ActionTypes.toggleIsShowParses, payload: articleId });
    const newArticle: Article = { ...article, isShowParse: !isShowParse };
    setArticle(newArticle);
  };

  const handleDelete = async () => {
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
          dispatch({ type: ActionTypes.startFetching });
          navigate(`/article/edit/${article.id}`);
        }}
      />
      <IconButtonCell
        icon={<SubjectIcon />}
        onClick={() => {
          dispatch({ type: ActionTypes.startFetching });
          navigate(`/article/${article.id}`);
        }}
      />
      <IconButtonCell
        icon={<PrintIcon />}
        onClick={() => {
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
      <IconButtonCell
        icon={isShowParse ? <FlashOnIcon /> : <FlashOffIcon />}
        onClick={handleToggleShowParses}
      />
      <IconButtonCell icon={<DeleteIcon />} onClick={handleDelete} />
    </TableRow>
  );
};

export default ArticleRow;
