import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { User } from '../../../services/useUsers';

export const useSelectUser = (
  users: User[],
  uid: string,
  onChangeUid?: (uid: string) => void
) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [value, setValue] = useState(uid || users[0].id);

  useEffect(() => {
    navigate({ pathname: location.pathname, search: `?uid=${value}` });
    !!onChangeUid && onChangeUid(value);
  }, [value, onChangeUid, history, location.pathname]);

  const onChangeValue = (value: string) => {
    setValue(value);
    navigate({ pathname: location.pathname, search: `?uid=${value}` });
    navigate(0);
  };

  return { value, onChangeValue };
};
