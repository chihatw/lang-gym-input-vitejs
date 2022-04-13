import { doc } from '@firebase/firestore';
import { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CreateUidOndoku } from '../../../../entities/UidOndoku';

import { db } from '../../../../repositories/firebase';
import { createUidOndoku } from '../../../../repositories/uidOndoku';
import { getUsers } from '../../../../repositories/user';
import { AppContext } from '../../../../services/app';
import { User } from '../../../../services/useUsers';

const COLLECTION = 'ondokus';

export const useCreateUidOndokuPage = (id: string, limit: number) => {
  const navigate = useNavigate();
  const { ondoku } = useContext(AppContext);

  const [title, setTitle] = useState('');
  const [users, setUsers] = useState<User[]>([]);
  const [uid, setUid] = useState('');

  useEffect(() => {
    setTitle(ondoku.title);
  }, [ondoku]);

  useEffect(() => {
    const fetchData = async () => {
      const users = await getUsers(limit);
      if (!!users) {
        setUsers(users);
        setUid(users[0].id);
      }
    };
    fetchData();
  }, [limit]);

  const onChangeUid = (uid: string) => {
    setUid(uid);
  };

  const onSubmit = async () => {
    const uidOndoku: CreateUidOndoku = {
      createdAt: new Date().getTime(),
      uid,
      ondoku: doc(db, COLLECTION, id),
    };
    const { success } = await createUidOndoku(uidOndoku);
    if (success) {
      navigate('/ondoku/list');
    }
  };

  return { initializing: false, title, users, uid, onChangeUid, onSubmit };
};
