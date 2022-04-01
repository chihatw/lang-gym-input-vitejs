import dayjs from 'dayjs';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { CreateOndoku } from '../../../../../entities/Ondoku';
import { createOndoku } from '../../../../../repositories/ondoku';

export const useCreateOndokuPage = () => {
  const navigate = useNavigate();
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
    const newOndoku: CreateOndoku = {
      createdAt: dayjs(date).valueOf(),
      downloadURL,
      isShowAccents,
      title,
    };
    const { success, ondokuID } = await createOndoku(newOndoku);
    if (success) {
      navigate(`/ondoku/${ondokuID}`);
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
