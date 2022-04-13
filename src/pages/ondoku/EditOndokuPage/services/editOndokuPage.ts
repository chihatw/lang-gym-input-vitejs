import dayjs from 'dayjs';
import { useNavigate } from 'react-router-dom';
import { useContext, useEffect, useState } from 'react';

import { Ondoku, useHandleOndokus } from '../../../../services/useOndokus';
import { AppContext } from '../../../../services/app';

export const useEditOndokuPage = (id: string) => {
  const navigate = useNavigate();
  const { ondoku } = useContext(AppContext);
  const { updateOndoku } = useHandleOndokus();

  const [date, setDate] = useState<Date>(new Date());
  const [isShowAccents, setIsShowAccents] = useState(false);
  const [title, setTitle] = useState('');
  const [downloadURL, setDownloadURL] = useState('');
  useEffect(() => {
    setDate(new Date(ondoku.createdAt));
    setIsShowAccents(ondoku.isShowAccents);
    setTitle(ondoku.title);
    setDownloadURL(ondoku.downloadURL);
  }, [ondoku]);
  const textFieldItems: {
    label: string;
    value: string;
    rows: number;
    onChange: (text: string) => void;
  }[] = [
    {
      label: 'title',
      value: title,
      rows: 1,
      onChange: (title: string) => {
        setTitle(title);
      },
    },
    {
      label: 'downloadURL',
      value: downloadURL,
      rows: 5,
      onChange: (url: string) => {
        setDownloadURL(url);
      },
    },
  ];
  const onPickDate = (date: Date | null) => {
    !!date && setDate(date);
  };
  const onToggleShowAccents = () => {
    setIsShowAccents(!isShowAccents);
  };
  const onSubmit = async () => {
    const newOndoku: Ondoku = {
      id,
      createdAt: dayjs(date).valueOf(),
      downloadURL,
      isShowAccents,
      title,
    };
    const result = await updateOndoku(newOndoku);
    if (!!result) {
      navigate('/ondoku/list');
    }
  };
  return {
    date,
    onSubmit,
    onPickDate,
    isShowAccents,
    textFieldItems,
    onToggleShowAccents,
  };
};
