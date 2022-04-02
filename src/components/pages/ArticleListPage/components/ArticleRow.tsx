import React from 'react';
import {
  Mic,
  Edit,
  Person,
  Delete,
  Subject,
  FlashOn,
  FlashOff,
  SettingsOutlined,
  VisibilityOutlined,
  VisibilityOffOutlined,
} from '@mui/icons-material';
import { TableRow, TableCell } from '@mui/material';

import { Article } from '../../../../services/useArticles';
import LinkIconCell from '../../../ui/LinkIconCell';
import TitleDateCell from './TitleDateCell';
import IconButtonCell from './IconButtonCell';

const ArticleRow = ({
  article,
  handleClickDelete,
  handleClickShowAccents,
  handleClickShowSentenceParses,
}: {
  article: Article;
  handleClickDelete: () => void;
  handleClickShowAccents: () => void;
  handleClickShowSentenceParses: () => void;
}) => {
  return (
    <TableRow>
      <TableCell padding='none' sx={{ whiteSpace: 'nowrap' }}>
        {article.userDisplayname}
      </TableCell>
      <TitleDateCell title={article.title} createdAt={article.createdAt} />
      <LinkIconCell icon={<Edit />} pathname={`/article/${article.id}/edit`} />
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
      <LinkIconCell icon={<Subject />} pathname={`/article/${article.id}`} />
      <LinkIconCell
        icon={<SettingsOutlined />}
        pathname={`/article/${article.id}/parse`}
      />
      <IconButtonCell
        icon={article.isShowParse ? <FlashOn /> : <FlashOff />}
        onClick={handleClickShowSentenceParses}
      />
      <LinkIconCell icon={<Mic />} pathname={`/article/${article.id}/voice`} />
      <LinkIconCell
        icon={<Person />}
        disabled={!article.downloadURL}
        pathname={`/article/${article.id}/assignment`}
      />
      <IconButtonCell icon={<Delete />} onClick={handleClickDelete} />
    </TableRow>
  );
};

export default ArticleRow;
