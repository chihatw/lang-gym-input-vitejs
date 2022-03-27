import { MaterialUiPickersDate } from '@material-ui/pickers/typings/date';
import { useEffect, useState } from 'react';
import { Ondoku } from '../../../../../entities/Ondoku';
import { getOndoku, updateOndoku } from '../../../../../repositories/ondoku';
import dayjs from 'dayjs';
import { useHistory } from 'react-router-dom';

export const useEditOndokuPage = (id: string) => {
  const history = useHistory();
  const [date, setDate] = useState<Date>(new Date());
  const [isShowAccents, setIsShowAccents] = useState(false);
  const [title, setTitle] = useState('');
  const [downloadURL, setDownloadURL] = useState('');
  useEffect(() => {
    const fetchData = async () => {
      const ondoku = await getOndoku(id);
      if (!!ondoku) {
        setDate(new Date(ondoku.createdAt));
        setIsShowAccents(ondoku.isShowAccents);
        setTitle(ondoku.title);
        setDownloadURL(ondoku.downloadURL);
      }
    };
    fetchData();
  }, [id]);
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
  const onPickDate = (date: MaterialUiPickersDate) => {
    !!date && setDate(date.toDate());
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
    const { success } = await updateOndoku(newOndoku);
    if (success) {
      history.push('/ondoku/list');
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
