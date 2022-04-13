import dayjs from 'dayjs';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { Ondoku, useHandleOndokus } from '../../../../services/useOndokus';

export const useCreateOndokuPage = () => {
  const navigate = useNavigate();
  const { addOndoku } = useHandleOndokus();
  const [date, setDate] = useState<Date>(new Date());
  const [isShowAccents, setIsShowAccents] = useState(false);
  const [title, setTitle] = useState('');
  const [downloadURL, setDownloadURL] = useState('');

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
    const newOndoku: Omit<Ondoku, 'id'> = {
      createdAt: dayjs(date).valueOf(),
      downloadURL,
      isShowAccents,
      title,
    };
    const result = await addOndoku(newOndoku);
    if (!!result) {
      navigate(`/ondoku/${result.id}`);
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
