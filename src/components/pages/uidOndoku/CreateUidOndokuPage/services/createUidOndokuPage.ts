import { doc } from '@firebase/firestore';
import { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { CreateUidOndoku } from '../../../../../entities/UidOndoku';
import { User } from '../../../../../entities/User';
import { db } from '../../../../../repositories/firebase';
import { getOndoku } from '../../../../../repositories/ondoku';
import { createUidOndoku } from '../../../../../repositories/uidOndoku';
import { getUsers } from '../../../../../repositories/user';

const COLLECTION = 'ondokus';

export const useCreateUidOndokuPage = (id: string, limit: number) => {
  const history = useHistory();
  const [initializing, setInitializing] = useState(true);
  const [title, setTitle] = useState('');
  const [users, setUsers] = useState<User[]>([]);
  const [uid, setUid] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      const ondoku = await getOndoku(id);
      !!ondoku && setTitle(ondoku.title);
      setInitializing(false);
    };
    fetchData();
  }, [id]);

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
      history.push('/ondoku/list');
    }
  };

  return { initializing, title, users, uid, onChangeUid, onSubmit };
};
