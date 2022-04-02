import dayjs from 'dayjs';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';

import { getUsers } from '../../../../repositories/user';
import { Article, useHandleArticles } from '../../../../services/useArticles';
import { User } from '../../../../services/useUsers';

export const useEditArticlePage = ({ article }: { article: Article }) => {
  const { updateArticle } = useHandleArticles();
  const navigate = useNavigate();
  const [uid, setUid] = useState('');
  const [date, setDate] = useState<Date>(new Date());
  const [users, setUsers] = useState<User[]>([]);
  const [title, setTitle] = useState('');
  const [embedID, setEmbedID] = useState('');
  const [isShowParse, setIsShowParse] = useState(false);
  const [isShowAccents, setIsShowAccents] = useState(false);

  // フォームの初期値設定
  useEffect(() => {
    if (!article.id) return;
    setUid(article.uid);
    setDate(new Date(article.createdAt));
    setTitle(article.title);
    setEmbedID(article.embedID);
    setIsShowParse(article.isShowParse);
    setIsShowAccents(article.isShowAccents);
  }, [article]);

  useEffect(() => {
    const fetchData = async () => {
      const users = await getUsers(5);
      !!users && setUsers(users);
      if (!!users) {
        setUsers(users);
        if (!article) {
          setUid(users[0].id);
        }
      }
    };
    fetchData();
  }, [article]);

  const switchItems: {
    label: string;
    checked: boolean;
    onChange: () => void;
  }[] = [
    {
      label: 'isShowAccents',
      checked: isShowAccents,
      onChange: () => {
        setIsShowAccents(!isShowAccents);
      },
    },
    {
      label: 'isShowParse',
      checked: isShowParse,
      onChange: () => {
        setIsShowParse(!isShowParse);
      },
    },
  ];

  const textFieldItems: {
    label: string;
    value: string;
    onChange: (text: string) => void;
  }[] = [
    {
      label: 'title',
      value: title,
      onChange: (text: string) => onChangeTitle(text),
    },
    {
      label: 'embedID',
      value: embedID,
      onChange: (text: string) => setEmbedID(text),
    },
  ];

  const onPickDate = (date: Date | null) => {
    !!date && setDate(date);
  };
  const onChangeTitle = (title: string) => {
    setTitle(title);
  };
  const onChangeUid = (uid: string) => {
    setUid(uid);
  };

  const onSubmit = async () => {
    const newArticle: Article = {
      ...article,
      uid,
      title,
      embedID,
      createdAt: dayjs(date).valueOf(),
      isShowParse,
      isShowAccents,
      userDisplayname: users.filter((u) => u.id === uid)[0].displayname,
    };
    const { success } = await updateArticle(newArticle);
    if (success) {
      navigate('/article/list');
    }
  };
  return {
    uid,
    date,
    users,
    title,
    onSubmit,
    onPickDate,
    onChangeUid,
    switchItems,
    textFieldItems,
  };
};
