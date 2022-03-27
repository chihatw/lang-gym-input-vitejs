import {
  Box,
  Table,
  TableRow,
  TableCell,
  TableBody,
  IconButton,
} from '@mui/material';
import Delete from '@mui/icons-material/Delete';
import {
  Subject,
  FlashOn,
  VisibilityOutlined,
  VisibilityOffOutlined,
  FlashOff,
} from '@mui/icons-material';
import Person from '@mui/icons-material/Person';
import Mic from '@mui/icons-material/Mic';
import SettingsOutlined from '@mui/icons-material/SettingsOutlined';
import Edit from '@mui/icons-material/Edit';
import React from 'react';
import { Article } from '../../../../entities/Article';
import { useArticleListPage } from './services/articleListPage';
import TableLayout from '../../../templates/TableLayout';
import dayjs from 'dayjs';

const ArticleListPage = () => {
  const {
    articles,
    history,
    onEdit,
    onDelete,
    onClickVoice,
    onClickSentences,
    onClickAssignment,
    onToggleShowAccents,
    onToggleShowParse,
    onClickSentenceParse,
  } = useArticleListPage(6);
  return (
    <TableLayout title='作文一覧' onCreate={() => history.push('/article')}>
      <Table>
        <TableBody>
          {articles.map((article) => (
            <TableRow key={article.id}>
              <UserNameCell article={article} />
              <TitleDateCell article={article} />
              <IconButtonCell
                icon={<Edit />}
                onClick={() => onEdit(article.id)}
              />
              <IconButtonCell
                icon={
                  article.isShowAccents ? (
                    <VisibilityOutlined />
                  ) : (
                    <VisibilityOffOutlined />
                  )
                }
                onClick={() => onToggleShowAccents(article)}
              />
              <IconButtonCell
                icon={<Subject />}
                onClick={() => {
                  onClickSentences(article.id);
                }}
              />
              <IconButtonCell
                icon={<SettingsOutlined />}
                onClick={() => onClickSentenceParse(article.id)}
              />
              <IconButtonCell
                icon={article.isShowParse ? <FlashOn /> : <FlashOff />}
                onClick={() => onToggleShowParse(article)}
              />
              <IconButtonCell
                icon={<Mic />}
                onClick={() => onClickVoice(article.id)}
              />
              <IconButtonCell
                icon={<Person />}
                onClick={() => onClickAssignment(article.id)}
                disabled={!article.downloadURL}
              />
              <IconButtonCell
                icon={<Delete />}
                onClick={() => onDelete(article)}
              />
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableLayout>
  );
};

export default ArticleListPage;

const UserNameCell: React.FC<{ article: Article }> = ({ article }) => {
  return (
    <TableCell padding='none'>
      <Box fontSize={14} whiteSpace='nowrap'>
        {article.userDisplayname}
      </Box>
    </TableCell>
  );
};

const TitleDateCell: React.FC<{ article: Article }> = ({ article }) => {
  return (
    <TableCell>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          fontSize: 14,
        }}
      >
        <div
          style={{
            width: 120,
            overflow: 'hidden',
            whiteSpace: 'nowrap',
            textOverflow: 'ellipsis',
          }}
        >
          {article.title}
        </div>
        <div>{dayjs(article.createdAt).format('YYYY/M/D')}</div>
      </div>
    </TableCell>
  );
};

const IconButtonCell: React.FC<{
  onClick: () => void;
  icon: React.ReactElement;
  disabled?: boolean;
}> = ({ onClick, icon, disabled }) => {
  return (
    <TableCell padding='none'>
      <IconButton size='small' onClick={onClick} disabled={disabled}>
        {icon}
      </IconButton>
    </TableCell>
  );
};
