import React from 'react';
import {
  Edit,
  MicOff,
  Person,
  Delete,
  Subject,
  FlashOn,
  MicNone,
  FlashOff,
  VisibilityOutlined,
  VisibilityOffOutlined,
} from '@mui/icons-material';
import { TableRow, TableCell } from '@mui/material';

import { Article } from '../../../services/useArticles';
import TitleDateCell from './TitleDateCell';
import IconButtonCell from './IconButtonCell';

const ArticleRow = ({
  article,
  openArticlePage,
  handleClickDelete,
  openAssignmentPage,
  openArticleEditPage,
  handleClickShowParses,
  handleClickShowAccents,
  handleClickShowRecButton,
}: {
  article: Article;
  openArticlePage: () => void;
  handleClickDelete: () => void;
  openAssignmentPage: () => void;
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
      <IconButtonCell icon={<Edit />} onClick={openArticleEditPage} />
      <IconButtonCell
        icon={
          article.isShowAccents ? (
            <VisibilityOutlined />
          ) : (
            <VisibilityOffOutlined />
          )
        }
        onClick={handleClickShowAccents}
      />
      <IconButtonCell icon={<Subject />} onClick={openArticlePage} />
      <IconButtonCell
        icon={article.isShowParse ? <FlashOn /> : <FlashOff />}
        onClick={handleClickShowParses}
      />
      <IconButtonCell
        icon={article.hasRecButton ? <MicNone /> : <MicOff />}
        onClick={handleClickShowRecButton}
      />
      <IconButtonCell
        icon={<Person />}
        disabled={!article.downloadURL}
        onClick={openAssignmentPage}
      />
      <IconButtonCell icon={<Delete />} onClick={handleClickDelete} />
    </TableRow>
  );
};

export default ArticleRow;
