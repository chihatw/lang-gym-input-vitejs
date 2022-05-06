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

import { Article } from '../../../../services/useArticles';
import TitleDateCell from './TitleDateCell';
import IconButtonCell from './IconButtonCell';

const ArticleRow = ({
  article,
  openArticlePage,
  handleClickDelete,
  openArticleEditPage,
  handleClickShowParses,
  handleClickShowAccents,
  handleClickShowRecButton,
}: {
  article: Article;
  openArticlePage: () => void;
  handleClickDelete: () => void;
  openArticleEditPage: () => void;
  handleClickShowParses: () => void;
  handleClickShowAccents: () => void;
  handleClickShowRecButton: () => void;
}) => {
  return (
    <TableRow>
      <TableCell padding='none' sx={{ whiteSpace: 'nowrap' }}>
        {article.userDisplayname}
      </TableCell>
      <TitleDateCell title={article.title} createdAt={article.createdAt} />
      <IconButtonCell icon={<EditIcon />} onClick={openArticleEditPage} />
      <IconButtonCell icon={<SubjectIcon />} onClick={openArticlePage} />
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
