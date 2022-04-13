import { useNavigate } from 'react-router-dom';
import React, { useState } from 'react';

import { Ondoku, useHandleOndokus } from '../../../services/useOndokus';
import CreateOndokuPageComponent from './components/CreateOndokuPageComponent';

const CreateOndokuPage = () => {
  const navigate = useNavigate();
  const { addOndoku } = useHandleOndokus();
  const [date, setDate] = useState<Date>(new Date());
  const [isShowAccents, setIsShowAccents] = useState(false);
  const [title, setTitle] = useState('');
  const [downloadURL, setDownloadURL] = useState('');

  const onPickDate = (date: Date | null) => {
    !!date && setDate(date);
  };
  const onToggleShowAccents = () => {
    setIsShowAccents(!isShowAccents);
  };
  const onSubmit = async () => {
    const newOndoku: Omit<Ondoku, 'id'> = {
      createdAt: date.getTime(),
      downloadURL,
      isShowAccents,
      title,
    };
    const result = await addOndoku(newOndoku);
    if (!!result) {
      navigate(`/ondoku/${result.id}`);
    }
  };
  return (
    <CreateOndokuPageComponent
      date={date}
      title={title}
      downloadURL={downloadURL}
      isShowAccents={isShowAccents}
      setTitle={setTitle}
      onSubmit={onSubmit}
      onPickDate={onPickDate}
      setDownloadURL={setDownloadURL}
      onToggleShowAccents={onToggleShowAccents}
    />
  );
};

export default CreateOndokuPage;
