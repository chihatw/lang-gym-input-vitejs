import { useHistory } from 'react-router';
import { auth } from '../../../../repositories/firebase';

export const useTopPage = () => {
  const history = useHistory();

  const itemsArray: { label: string; onClick: () => void }[][] = [
    [
      { label: '音読一覧', onClick: () => history.push('/ondoku/list') },
      {
        label: 'ユーザー音読一覧',
        onClick: () => history.push('/uidOndoku/list'),
      },
    ],
    [
      { label: '作文一覧', onClick: () => history.push('/article/list') },
      { label: '作文処理', onClick: () => history.push('/article/input') },
    ],
    [
      {
        label: 'アクセント問題一覧',
        onClick: () => history.push('/accentsQuestion/list'),
      },
      {
        label: 'リズム問題一覧',
        onClick: () => history.push('/rhythmsQuestion/list'),
      },
    ],
    [{ label: 'audioItems', onClick: () => history.push('/audioItems') }],
    [{ label: 'バッチ処理', onClick: () => history.push('/batch') }],
    [{ label: 'Sign Out', onClick: () => auth.signOut() }],
  ];
  return { itemsArray };
};
