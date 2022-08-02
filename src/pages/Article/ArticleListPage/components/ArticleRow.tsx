import EditIcon from '@mui/icons-material/Edit';
import React from 'react';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityOffOutlinedIcon from '@mui/icons-material/VisibilityOffOutlined';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import SubjectIcon from '@mui/icons-material/Subject';
import MicOffIcon from '@mui/icons-material/MicOff';
import FlashOnIcon from '@mui/icons-material/FlashOn';
import MicNoneIcon from '@mui/icons-material/MicNone';
import FlashOffIcon from '@mui/icons-material/FlashOff';
import { TableRow, TableCell } from '@mui/material';

import TitleDateCell from './TitleDateCell';
import IconButtonCell from './IconButtonCell';
import PrintIcon from '@mui/icons-material/Print';
import { Article, State } from '../../../../Model';
import { Action, ActionTypes } from '../../../../Update';
import { useNavigate } from 'react-router-dom';

const ArticleRow = ({
  index,
  state,
  dispatch,
  handleClickDelete,
  handleClickShowParses,
  handleClickShowAccents,
  handleClickShowRecButton,
}: {
  index: number;
  state: State;
  dispatch: React.Dispatch<Action>;
  handleClickDelete: () => void;
  handleClickShowParses: () => void;
  handleClickShowAccents: () => void;
  handleClickShowRecButton: () => void;
}) => {
  const { articleList } = state;
  const article = articleList[index];
  const { id } = article;
  const navigate = useNavigate();
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
          article.isShowAccents ? (
            <VisibilityOutlinedIcon />
          ) : (
            <VisibilityOffOutlinedIcon />
          )
        }
        onClick={handleClickShowAccents}
      />
      <IconButtonCell
        icon={article.isShowParse ? <FlashOnIcon /> : <FlashOffIcon />}
        onClick={handleClickShowParses}
      />
      <IconButtonCell
        icon={article.hasRecButton ? <MicNoneIcon /> : <MicOffIcon />}
        onClick={handleClickShowRecButton}
      />
      <IconButtonCell icon={<DeleteIcon />} onClick={handleClickDelete} />
    </TableRow>
  );
};

export default ArticleRow;
