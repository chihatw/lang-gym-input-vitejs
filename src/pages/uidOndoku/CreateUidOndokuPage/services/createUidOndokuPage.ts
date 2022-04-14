import { doc } from '@firebase/firestore';
import { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { db } from '../../../../repositories/firebase';
import { AppContext } from '../../../../services/app';
import {
  UidOndoku,
  useHandleUidOndokus,
} from '../../../../services/useUidOndokus';

const COLLECTION = 'ondokus';

export const useCreateUidOndokuPage = (id: string, limit: number) => {
  const navigate = useNavigate();
  const { ondoku, users } = useContext(AppContext);

  const { createUidOndoku } = useHandleUidOndokus();

  const [title, setTitle] = useState('');
  const [uid, setUid] = useState('');

  useEffect(() => {
    setTitle(ondoku.title);
  }, [ondoku]);

  useEffect(() => {
    setUid(users[0].id);
  }, [users]);

  const onChangeUid = (uid: string) => {
    setUid(uid);
  };

  const onSubmit = async () => {
    const uidOndoku: Omit<UidOndoku, 'id'> = {
      createdAt: new Date().getTime(),
      uid,
      ondoku: doc(db, COLLECTION, id),
    };
    const createdItem = await createUidOndoku(uidOndoku);
    if (!!createdItem) {
      navigate('/ondoku/list');
    }
  };

  return { initializing: false, title, users, uid, onChangeUid, onSubmit };
};
