import { MaterialUiPickersDate } from '@material-ui/pickers/typings/date';
import { useEffect, useState } from 'react';

import dayjs from 'dayjs';
import { useHistory } from 'react-router-dom';
import { CreateArticle } from '../../../../../entities/Article';
import { createArticle } from '../../../../../repositories/article';
import { User } from '../../../../../entities/User';
import { getUsers } from '../../../../../repositories/user';

export const useCreateArticlePage = () => {
  const history = useHistory();
  const [date, setDate] = useState<Date>(new Date());
  const [isShowAccents, setIsShowAccents] = useState(false);
  const [isShowParse, setIsShowParse] = useState(false);
  const [embedID, setEmbedID] = useState('');
  const [title, setTitle] = useState('');
  const [downloadURL, setDownloadURL] = useState('');
  const [users, setUsers] = useState<User[]>([]);
  const [uid, setUid] = useState('');
  const [marksStr, setMarksStr] = useState('0');

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
      onChange: (text: string) => setTitle(text),
    },
    {
      label: 'embedID',
      value: embedID,
      multiline: false,
      rows: 1,
      onChange: (text: string) => setEmbedID(text),
    },
    {
      label: 'marksStr',
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
      onChange: (text: string) => setDownloadURL(text),
    },
  ];

  useEffect(() => {
    const fetchData = async () => {
      const users = await getUsers(10);
      if (!!users) {
        setUsers(users);
        setUid(users[0].id);
      }
    };
    fetchData();
  }, []);

  const onPickDate = (date: MaterialUiPickersDate) => {
    !!date && setDate(date.toDate());
  };

  const onChangeUid = (uid: string) => {
    setUid(uid);
  };
  const onSubmit = async () => {
    const parsedJSON = JSON.parse(marksStr || '0');
    const marks: string[] = Array.isArray(parsedJSON)
      ? parsedJSON.map((i) => String(i))
      : [];

    const article: CreateArticle = {
      createdAt: dayjs(date).valueOf(),
      downloadURL,
      isShowAccents,
      isShowParse,
      embedID,
      title,
      uid,
      userDisplayname: users.filter((u) => u.id === uid)[0].displayname,
      marks,
    };
    const { success, articleID } = await createArticle(article);
    if (success) {
      history.push(`/article/${articleID}`);
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
