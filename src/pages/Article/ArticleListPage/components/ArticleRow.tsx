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
import { updateArticle } from '../../../../services/article';

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
  const { id, isShowParse, isShowAccents } = article;
  const navigate = useNavigate();

  const handleToggleShowAccents = async () => {
    dispatch({ type: ActionTypes.toggleIsShowAccents, payload: id });
    const newArticle: Article = { ...article, isShowAccents: !isShowAccents };
    await updateArticle(newArticle);
  };

  const handleToggleShowParses = async () => {
    dispatch({ type: ActionTypes.toggleIsShowParses, payload: id });
    const newArticle: Article = { ...article, isShowParse: !isShowParse };
    await updateArticle(newArticle);
  };

  const handleDelete = async () => {
    // todo
    // local
    // remote
    // cloudStorage
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
          navigate(`/article/print/${id}`);
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
