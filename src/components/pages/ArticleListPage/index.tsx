import {
  onSnapshot,
  collection,
  query,
  orderBy,
  limit,
} from '@firebase/firestore';

import dayjs from 'dayjs';
import { useHistory } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import {
  Box,
  Table,
  TableRow,
  TableCell,
  TableBody,
  IconButton,
} from '@mui/material';
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

import { db } from '../../../repositories/firebase';
import TableLayout from '../../templates/TableLayout';
import { Article } from '../../../entities/Article';
import { deleteFile } from '../../../repositories/file';
import { buildArticle } from '../../../entities/Article';
import { deleteSentences } from '../../../repositories/sentence';
import { deleteArticle, updateArticle } from '../../../repositories/article';

const LIMIT = 6;

// TODO article に hasRecButton を追加
// OPTIMIZE firebase 9.0, データベースとのやりとりをAppに上げる

const COLLECTION = 'articles';

const articlesRef = collection(db, COLLECTION);

const ArticleListPage = () => {
  const history = useHistory();

  const [articles, setArticles] = useState<Article[]>([]);
  useEffect(() => {
    const q = query(articlesRef, orderBy('createdAt', 'desc'), limit(LIMIT));
    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        console.log('snapshot article');
        const articles = snapshot.docs.map((doc) =>
          buildArticle(doc.id, doc.data())
        );
        setArticles(articles);
      },
      (e) => {
        console.warn(e);
      }
    );

    return () => {
      unsubscribe();
    };
    // articlesRefをdependanciesに加えるとループする
    // eslint-disable-next-line
  }, [history]);

  const onEdit = (articleID: string) => {
    history.push(`/article/${articleID}/edit`);
  };
  const onClickSentences = (articleID: string) => {
    history.push(`/article/${articleID}`);
  };
  const onClickSentenceParse = (articleID: string) => {
    history.push(`/article/${articleID}/parse`);
  };
  const onClickVoice = (articleID: string) => {
    history.push(`/article/${articleID}/voice`);
  };
  const onClickAssignment = (articleID: string) => {
    history.push(`/article/${articleID}/assignment`);
  };
  const onToggleShowAccents = async (article: Article) => {
    const newArticle: Article = {
      ...article,
      isShowAccents: !article.isShowAccents,
    };
    await updateArticle(newArticle);
  };
  const onToggleShowParse = async (article: Article) => {
    const newArticle: Article = {
      ...article,
      isShowParse: !article.isShowParse,
    };
    await updateArticle(newArticle);
  };
  const onDelete = async ({
    id,
    title,
    downloadURL,
  }: {
    id: string;
    title: string;
    downloadURL: string;
  }) => {
    if (window.confirm(`${title}を削除しますか`)) {
      if (downloadURL) {
        const path = decodeURIComponent(
          downloadURL.split('/')[7].split('?')[0]
        );
        await deleteFile(path);
      }
      await deleteSentences(id);
      await deleteArticle(id);
    }
  };

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
