import dayjs from 'dayjs';
import { useHistory } from 'react-router-dom';
import { useEffect, useState } from 'react';

import { User } from '../../../../../entities/User';
import { Article } from '../../../../../entities/Article';
import { getUsers } from '../../../../../repositories/user';
import { getArticle, updateArticle } from '../../../../../repositories/article';

export const useEditArticlePage = (id: string) => {
  const history = useHistory();
  const [date, setDate] = useState<Date>(new Date());
  const [isShowAccents, setIsShowAccents] = useState(false);
  const [isShowParse, setIsShowParse] = useState(false);
  const [embedID, setEmbedID] = useState('');
  const [marksStr, setMarksStr] = useState('0');
  const [title, setTitle] = useState('');
  const [downloadURL, setDownloadURL] = useState('');
  const [users, setUsers] = useState<User[]>([]);
  const [uid, setUid] = useState('');
  const [originalArticle, setOriginalArticle] = useState<Article | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      const article = await getArticle(id);
      if (!!article) {
        setUid(article.uid);
        setDate(new Date(article.createdAt));
        setIsShowAccents(article.isShowAccents);
        setIsShowParse(article.isShowParse);
        setTitle(article.title);
        setDownloadURL(article.downloadURL);
        setMarksStr(JSON.stringify(article.marks));
        setEmbedID(article.embedID);
        setOriginalArticle(article);
      }

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
  }, [id]);

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
    multiline: boolean;
    rows: number;
    onChange: (text: string) => void;
  }[] = [
    {
      label: 'title',
      value: title,
      multiline: false,
      rows: 1,
      onChange: (text: string) => onChangeTitle(text),
    },
    {
      label: 'embedID',
      value: embedID,
      multiline: false,
      rows: 1,
      onChange: (text: string) => setEmbedID(text),
    },
    {
      label: 'marks',
      value: marksStr,
      multiline: false,
      rows: 1,
      onChange: (text: string) => setMarksStr(text),
    },
    {
      label: 'downloadURL',
      value: downloadURL,
      multiline: true,
      rows: 5,
      onChange: (text: string) => onChangeDownloadURL(text),
    },
  ];

  const onPickDate = (date: Date | null) => {
    !!date && setDate(date);
  };
  const onChangeTitle = (title: string) => {
    setTitle(title);
  };
  const onChangeDownloadURL = (url: string) => {
    setDownloadURL(url);
  };
  const onChangeUid = (uid: string) => {
    setUid(uid);
  };

  const onSubmit = async () => {
    const parsedJSON = JSON.parse(marksStr);
    const marks: string[] = Array.isArray(parsedJSON)
      ? parsedJSON.map((i) => String(i))
      : [];

    const article: Article = {
      ...originalArticle!,
      createdAt: dayjs(date).valueOf(),
      downloadURL,
      isShowAccents,
      isShowParse,
      embedID,
      title,
      uid,
      marks,
      userDisplayname: users.filter((u) => u.id === uid)[0].displayname,
    };
    const { success } = await updateArticle(article);
    if (success) {
      history.push('/article/list');
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
